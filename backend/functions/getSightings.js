import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    // console.log("sighterId" in event.queryStringParameters && "sightedId" in event.queryStringParameters);
    if (event.queryStringParameters == null) {
        const params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: {
                ':pk': 'SIGHTING'
            }
        };
        var result = await dynamoDb.query(params);
    } else if (!("sighterId" in event.queryStringParameters) && "sightedId" in event.queryStringParameters) {
        const paramsSighted = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: 'pk = :pk and sk > :sk',
            ExpressionAttributeValues: {
                ':pk': 'USER-' + event.queryStringParameters.sightedId, // This would be the query string parameter value of sightedId
                ':sk': 'SIGHTED'
            }
        };
        var result = await dynamoDb.query(paramsSighted);
    } else if ("sighterId" in event.queryStringParameters && !("sightedId" in event.queryStringParameters)) {
        const paramsSighter = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: 'pk = :pk and sk > :sk',
            ExpressionAttributeValues: {
                ':pk': 'USER-' + event.queryStringParameters.sighterId, // This would be the query string parameter value of sighterId
                ':sk': 'SIGHTER'
            }
        };
        var result = await dynamoDb.query(paramsSighter);
    } else if ("sighterId" in event.queryStringParameters && "sightedId" in event.queryStringParameters){
        throw new Error("sighterId and sightedId can not be used together.")
    }

    if (!result.Items) {
        throw new Error("Item not found.");
    }

    // Return the retrieved item
    return result.Items;
});