const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB();
const table = "Users";
AWS.config.update({region : "us-east-2"});
// const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const username = event.pathParameters.username;
    const userWithUsername = {
        TableName: table,
        FilterExpression: `contains(username, :user)`,
        ExpressionAttributeValues: {
            ":user": {
                S: username
            }
        }
    }
    
    const userResults = await ddb.scan(userWithUsername).promise();
    console.log(userResults);
    let result = {};
    if(!userResults.Count){
        result["statusCode"] = 404;
        result["body"] = "No such user";
    }else{
        result["statusCode"] = 200;
        result["body"] = userResults.Items;
        result["body"] = JSON.stringify(result["body"]);
    }
    return result;
}