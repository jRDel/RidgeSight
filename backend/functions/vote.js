import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";
import dynamodb from "../util/dynamodb";

export const main = handler(async (event, context) => {
    const data = JSON.parse(event.body);
    console.log("data recieved is: ", data);
    const userId = data.userId;
    const sightingId = data.sightingId;
    const vote = data.vote;

    const getUserParams = {
        // KeyConditionExpression: 'pk = :pk AND sk = :sk',
        // ExpressionAttributeValues: {
        //     ':pk': 'USER',
        //     ":sk": ''+userId,
        // }
        Key: {
            pk: 'USER-'+userId,
            sk: 'PROFILE'
        },
        TableName: process.env.TABLE_NAME,
    }
    let user = (await dynamoDb.get(getUserParams)).Item;
    console.log("got user ", user);

    const prevThumbsUp = user.thumbsUp && user.thumbsUp.values.includes(sightingId);
    const prevThumbsDown = user.thumbsDown && user.thumbsDown.values.includes(sightingId);

    let voteUpdateExpression;
    let userUpdateExpression;
    if (prevThumbsUp && data.vote === -1) {
        voteUpdateExpression = "SET thumbsUp = thumbsUp - :inc, thumbsDown = thumbsDown + :inc";
        userUpdateExpression = "DELETE thumbsUp :sightingId ADD thumbsDown :sightingId";
    } else if (prevThumbsDown && data.vote === 1) {
        voteUpdateExpression = "SET thumbsUp = thumbsUp + :inc, thumbsDown = thumbsDown - :inc";
        userUpdateExpression = "ADD thumbsUp :sightingId DELETE thumbsDown :sightingId";
    } else if (!prevThumbsDown && !prevThumbsUp && vote === 1) {
        voteUpdateExpression = "SET thumbsUp = thumbsUp + :inc";
        userUpdateExpression = "ADD thumbsUp :sightingId";
    } else if (!prevThumbsDown && !prevThumbsUp && vote === -1) {
        voteUpdateExpression = "SET thumbsDown = thumbsDown + :inc";
        userUpdateExpression = "ADD thumbsDown :sightingId";
    } else if (prevThumbsUp && vote === 0) {
        voteUpdateExpression = "SET thumbsUp = thumbsUp - :inc";
        userUpdateExpression = "DELETE thumbsUp :sightingId";
    } else if (prevThumbsDown && vote === 0) {
        voteUpdateExpression = "SET thumbsDown = thumbsDown - :inc";
        userUpdateExpression = "DELETE thumbsDown :sightingId";
    } else {
        console.log("no change needed");
        return "No change needed";
    }

    const voteParams = {
        Key: {
            pk: "SIGHTING",
            sk: data.sightingId,
        }, 
        UpdateExpression: voteUpdateExpression,
        ExpressionAttributeValues: {
            ":inc": 1,
        },
        ReturnValues: "UPDATED_NEW",
        TableName: process.env.TABLE_NAME,
    }

    const userParams = {
        Key: {
            pk: "USER-"+userId,   
            sk: "PROFILE"
        }, 
        UpdateExpression: userUpdateExpression,
        ExpressionAttributeValues: {
            ":sightingId": dynamodb.client.createSet([sightingId]),
        },
        ReturnValues: "UPDATED_NEW",
        TableName: process.env.TABLE_NAME,
    }

    const result = await Promise.all([await dynamoDb.update(voteParams), await dynamoDb.update(userParams)])
    console.log("finished executing all puts result is ", result);

    return "ok";
});