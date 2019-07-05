const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB();
const table = "Users";
AWS.config.update({region : "us-east-2"});

exports.handler = async (event) => {
    const username = event.username;
    const userWithUsername = {
        TableName: table,
        KeyConditionExpression: "#user = :user",
        ExpressionAttributeNames:{
            "#user": "username"
        },
        ExpressionAttributeValues: {
            ":user":{
                S: username
            }
        }   
    }
    const userResults = await ddb.query(userWithUsername).promise();
    let result;
    if(userResults.Count == 0){
        result = "No such user";
    }else{
        result = userResults.Items[0];
    }
    return result;
}