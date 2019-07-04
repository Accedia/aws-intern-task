const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-2" });
const s3 = new AWS.S3();
const srcBucket = "accedia-users-avatars";
const table = "Users";

exports.handler = async(event) => {
    // Some way we have to give the user through the event
    const ddb = new AWS.DynamoDB();
    const type = event.image.split(";")[0].split("/")[1];
    const base64String = event.image.replace(/^data:image\/\w+;base64,/, "");
    console.log(base64String);
    const base64Data = Buffer.from(base64String, 'base64');
    
    let userWithUsername = {
        TableName: table,
        ProjectionExpression: "username",
        KeyConditionExpression: "username = :user ",
        ExpressionAttributeValues: {
            ":user": {
                S: "Drugaru"
            }
        }
    }
    let hasUser = await ddb.query(userWithUsername).promise();
    console.log(hasUser);
    
    if(hasUser.Count > 0){
        return "Username in use!";
    }
    
    let imageUpload = { 
        Bucket: srcBucket,
        Key: `${event.username}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    }
    
    let avatarUrl = await s3.upload(imageUpload).promise();
    console.log("Avatar url created:"); 
    console.log(avatarUrl.Location);
    const userToBeInserted = {
        Item: {
            "username": {
                S: event.username
            },
            "firstName": {
                S: event.firstName
            },
            "lastName": {
                S: event.lastName
            },
            "password": {
                S: event.password
            },
            "email": {
                S: event.email
            },
            "avatarUrl": {
                S: avatarUrl.Location
            }
        },
        "TableName": "Users"
    };

    await ddb.putItem(userToBeInserted).promise();
    return { Successful : true };
};
