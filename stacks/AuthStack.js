import * as iam from "aws-cdk-lib/aws-iam";
import { Auth, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }) {
  const { bucket, table } = use(StorageStack);
  const { api } = use(ApiStack);

  /*
  We need to require given_name and family name
  Login through email (nothing else)
  */
  // Create a Cognito User Pool and Identity Pool
  const auth = new Auth(stack, "Auth", {
    cdk: {
      userPool: {
        standardAttributes: {
          givenName: { required: true, mutable: false },
          familyName: { required: true, mutable: false },      
        },
      }
    },
    login: ["email"],
    triggers: {
      postConfirmation: {
          permissions: [table],
          environment: {
              TABLE_NAME: table.tableName,
          },
          handler: "functions/newUser.main"
      }
    }
  });

  auth.attachPermissionsForAuthUsers([
    // Allow access to the API
    api,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  // Return the auth resource
  return {
    auth,
  };
}