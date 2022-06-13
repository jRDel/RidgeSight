import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
    const { table } = use(StorageStack);

    // Create the API
    const api = new Api(stack, "Api", {
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
            "GET /profile/{id}": "functions/getProfileById.main",
            "GET /profile": "functions/getAllProfiles.main",
            "GET /sighting": "functions/getSightings.main",
            "GET /scoreboard": "functions/scoreboard.main",
            "POST /vote": "functions/vote.main"
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