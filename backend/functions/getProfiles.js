import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    
    if (event.queryStringParameters == null){
        var params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: {
                ':pk': 'USER'
            }
        };
        var result = await dynamoDb.query(params);
    } else if ("id" in event.queryStringParameters){
        var params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: 'pk = :pk and sk = :sk',
            ExpressionAttributeValues: {
                ':pk': 'USER' + event.queryStringParameters.id,
                ':sk': 'PROFILE'
            }
        };
        var result = await dynamoDb.query(params);
    } else if (!("id" in event.queryStringParameters)){
        throw new Error("id parameter required")
    }
    
    
    if (!result.Items) {
        throw new Error("Item not found.");
    }

    // Return the retrieved item
    return result.Items;
});