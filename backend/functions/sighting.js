// import * as uuid from "uuid";
import handler from "../util/handler";
// import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    // const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            // The attributes of the item to be created
            title: "Jake Sighted at Bowling Alley!",
            description: "Saw Jake leaving the bowling alley. Think I managed to get a photo before he saw me >:).",
            // pictureArn: data.attachment,
            latitude: 39.247229,
            logitude: -119.948557,
            sighterId: 0,
            sightedId: 1,
            thumbsUp: 4,
            thumbsDown: 1,
            createdAt: "2022-06-09",// date.now,
        },
    };

    // await dynamoDb.put(params);

    return params.Item;
});