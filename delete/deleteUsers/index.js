const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB;
const srcBucket = "accedia-users-avatars";
AWS.config.update( {region:"us-east-2"} );
const docClient = new AWS.DynamoDB.DocumentClient();
const table = "Users";

exports.handler = async (event) => {
    const username = event.username;
    const imageToDelete = {
        Bucket: srcBucket,
        Key: username
    } 
    const userToDelete = {
        TableName : table,
        Key : {
            "username" : username
        } 
    };
    const userToDeleteCheck = {
        TableName: table,
        ProjectionExpression: "username",
        KeyConditionExpression: "username = :user",
        ExpressionAttributeValues: {
            ":user": {
                S: event.username
            }
        }
    }
    const userFound = await ddb.query(userToDeleteCheck).promise();
    let result;
    if(userFound.Count == 0) {
        result = "No such user";
    } else {
        console.log("Deleting " + username + "!");
        await s3.deleteObject(imageToDelete).promise();
        await docClient.delete(userToDelete).promise();
        result = userToDelete.Key;
    }
    return result;
}
