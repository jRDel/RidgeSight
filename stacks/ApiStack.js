import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
    const { table } = use(StorageStack);

    //console.log("STACK table name is ", table.tableName);

    // Create the API
    const api = new Api(stack, "Api", {
        cors: true,
        defaults: {
            //  authorizer: "iam", 
            function: {
                permissions: [table],
                environment: {
                    TABLE_NAME: table.tableName,
                },
            },
        },
        routes: {
            "GET /": "functions/lambda.handler",
            "POST /sighting": "functions/createSighting.main",
            "POST /profile": "functions/newUser.main",
            "POST /profilePicture": "functions/profilePicture.main",
            "GET /profile": "functions/getProfiles.main",
            "GET /sighting": "functions/getSightings.main",
            "GET /scoreboard": "functions/scoreboard.main",
            "POST /vote": "functions/vote.main",
            // "$default": "functions/dne.main",
        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    // Return the API resource
    return {
        api,
    };
}