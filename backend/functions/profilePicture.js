import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    console.log(event);
    const data = JSON.parse(event.body);
    if ("userId" in event.queryStringParameters){
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                pk: "USER-" + event.queryStringParameters.userId,
                sk: "PROFILE"
            },
            ExpressionAttributeValues: {
                ":arn": data.attachment,
            },
            UpdateExpression: "set pictureArn = :arn"
        };
        var result = await dynamoDb.update(params);
        return params.Item;
    } else {
        throw new Error("id parameter required")
    }
});