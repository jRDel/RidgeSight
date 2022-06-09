import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
    const { table } = use(StorageStack);

    // Create the API
    const api = new Api(stack, "Api", {
        defaults: {
            // authorizer: "iam",
            function: {
                permissions: [table],
                environment: {
                    TABLE_NAME: table.tableName,
                },
            },
        },
        routes: {
            "GET /": "functions/lambda.handler",
            "GET /profile/{id}": "functions/profile.main",
            "GET /profile": "functions/profile.main",
            "GET /sighting": "functions/sighting.main",
            "POST /sighting": "functions/sighting.main",
            "GET /scoreboard": "functions/scoreboard.main",
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