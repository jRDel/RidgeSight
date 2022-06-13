import dynamoDb from "../util/dynamodb";

export const main = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log(event,data);
    console.log("table is ", process.env.TABLE_NAME)
    // If the required parameters are present, proceed
    if (event.request.userAttributes.sub) {
        let user = {
            'id': event.request.userAttributes.sub,
            "firstname": event.request.userAttributes.given_name,
            "lastname":  event.request.userAttributes.family_name,
            "email": event.request.userAttributes.email,
            "pictureArn": {S: data.attachment},
            "awards": [],
            "votes": {}
        }

        let dbUserItemParams = {
            Item: {
                "pk": "USER",
                "sk": user.firstname+'-'+user.lastname+'-'+user.id,
                "id": user.id,
                "firstname": user.firstname,
                "lastname":  user.lastname,
                "pictureArn": user.pictureArn,
            },
            TableName: process.env.TABLE_NAME,
        };

        let dbUserProfileParams = {
            Item: {
                "pk": "USER-"+user.id,
                "sk": "PROFILE",
                ...user
            },
            TableName: process.env.TABLE_NAME,
        };

        // Call DynamoDB
        try {
            await Promise.all([dynamoDb.put(dbUserItemParams), dynamoDb.put(dbUserProfileParams)])
            console.log("Success");
        } catch (err) {
            console.log("Error", err);
        }

        console.log("Success: Everything executed correctly");
        context.done(null, event);

    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("Error: Nothing was written to DDB or SQS");
        context.done(null, event);
    }
};
  