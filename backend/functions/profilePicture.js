import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body);
    if ("userId" in event.queryStringParameters){
        var profileParams = {
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
        var userParams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                pk: "USER",
                sk: event.queryStringParameters.userId
            },
            ExpressionAttributeValues: {
                ":arn": data.attachment
            },
            UpdateExpression: "set pictureArn = :arn"
        };
        await dynamoDb.update(profileParams);
        await dynamoDb.update(userParams);
        return profileParams.Item, userParams.Item;
    } else {
        throw new Error("userId parameter required")
    }
});