import * as uuid from "uuid";
import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

const attributes = [
    "title",
    "description",
    "pictureArn",
    "longitude",
    "latitude",
    "sighterId",
    "sightedId",
    "sighterName",
    "sightedName",
    "thumbsUp",
    "thumbsDown",
    "createdAt",
]

export const main = handler(async (event) => {
    console.log("starting to create a new sighting")
    const data = JSON.parse(event.body);
    console.log("data recieved is: ", data);

    let sighting = {}
    attributes.forEach((attr) => {
        sighting[attr] = data[attr]
    })
    sighting = {...sighting, thumbsUp: 0, thumbsDown: 0, createdAt: (new Date()).toISOString(), id: uuid.v1()}
    console.log("The new sighting is ", sighting);

    const sightingDataParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            "pk": "SIGHTING",
            "sk": sighting.id,
            ...sighting
        },
    };
    const sightingDataPromise = dynamoDb.put(sightingDataParams)

    const sighterParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            "pk": "USER-"+sighting.sighterId,
            "sk": "SIGHTER-"+sighting.createdAt+"-"+sighting.id,
            ...sighting
        },
    };
    delete sighterParams.Item.thumbsDown;
    delete sighterParams.Item.thumbsUp;
    const sighterPromise = dynamoDb.put(sighterParams);

    const sightingPromises = sighting.sightedId.map((sightedId) => {
        const sightedParams = {
            TableName: process.env.TABLE_NAME,
            Item: {
                "pk": "USER-"+sightedId,
                "sk": "SIGHTED-"+sighting.createdAt+"-"+sighting.id,
                ...sighting
            },
        };
        delete sightedParams.Item.thumbsDown;
        delete sightedParams.Item.thumbsUp;
        return dynamoDb.put(sightedParams);
    })

    const result = await Promise.all([sightingDataPromise, sightingDataParams, sighterPromise, ...sightingPromises])
    console.log("finished executing all puts result is ", result);

    return "ok";
});