import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body);
    console.log("data recieved is: ", data);

    const voteParams = {
        Key: {
            "pk": {
                S: "SIGHTING"
                }, 
            "sk": {
                S: data.id
            }
        }, 
        UpdateExpression: "SET thumbsUp = thumpsUp + :inc",
        ExpressionAttributeValues: {
            ":inc": {"N": data.vote}
        },
        ReturnValues: "Updated_NEW",
        TableName: process.env.TABLE_NAME,
        IndexName: "pkIdIndex"
    }
    
    let votePromise = dynamoDb.update(voteParams)

    const result = await votePromise;
    console.log("finished executing all puts result is ", result);

    return result;
});