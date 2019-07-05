const AWS = require('aws-sdk');
const s3 = new AWS.S3();
// const ddb = new AWS.DynamoDB();
const table = "Users";
AWS.config.update({region : "us-east-2"});
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const username = event.pathParameters.username;
    const userWithUsername = {
        TableName: table,
        Key : {
            "username": username
        },
        ExpressionAttributeValues: {
            ":user":{
                S: username
            }
        }   
    }
    const userResults = await documentClient.get(userWithUsername).promise();
    console.log(userResults);
    let result = {};
    if(!userResults.Item){
        result["statusCode"] = 404;
        result["body"] = "No such user";
    }else{
        result["statusCode"] = 200;
        result["body"] = userResults.Item;
        for(let value in result.body){
            result.body[value] = result.body[value];
        }
        result["body"] = JSON.stringify(result["body"]);
    }
    return result;
}