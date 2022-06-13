import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body);
    console.log("data recieved is: ", data);

    const voteParams = {
        Key: {
            pk: {
                S: "SIGHTING"
            }, 
            sk: {
                S: data.sightingId
            }
        }, 
        UpdateExpression: "SET thumbsUp = thumpsUp + :inc",
        ExpressionAttributeValues: {
            ":inc": data.vote,
        },
        ReturnValues: "UPDATED_NEW",
        TableName: process.env.TABLE_NAME,
    }
    
    let votePromise = dynamoDb.update(voteParams)

    const result = await votePromise;
    console.log("finished executing all puts result is ", result);

    // TODO need to update the user with the vote

    return result;
});