// import * as uuid from "uuid";
import handler from "../util/handler";
// import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    // const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            // The attributes of the item to be created
            id: 0, // The id of the author
            name: "Alexander Peek",
            email: "alexander.peek@ridgelinapps.com",
            // pictureArn: data.attachment,
            awards: ["Worst Fit", "Most Upvoted"],
        },
    };

    // await dynamoDb.put(params);

    return params.Item;
});