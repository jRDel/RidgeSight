// import * as uuid from "uuid";
import handler from "../util/handler";
// import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
    // const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            // The attributes of the item to be created
            award: "Worst Fit",
        },
    };

    // await dynamoDb.put(params);

    return params.Item;
});