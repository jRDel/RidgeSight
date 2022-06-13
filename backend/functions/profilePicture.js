import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    console.log(event);
    const data = JSON.parse(event.body);
    if ("id" in event.queryStringParameters){
        var params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                pk: "USER" + event.queryStringParameters.id,
                sk: "PROFILE"
            },
            Item: {
                pictureArn: data.attachment,
            }
        };
        var result = await dynamoDb.update(params);
        return params.Item;
    } else {
        throw new Error("id parameter required")
    }
});