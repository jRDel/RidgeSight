import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
            ':pk': 'USER'
        }
    };

    const result = await dynamoDb.query(params);
    if (!result.Items) {
        throw new Error("Item not found.");
    }

    // Return the retrieved item
    return result.Items;
});