const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB();
const table = "Users";
AWS.config.update({region : "us-east-2"});
// const documentClient = new AWS.DynamoDB.DocumentClient();
class Response {
    constructor(statusCode, body){
        this.statusCode = statusCode;
        this.body = body;
    };       
}
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
    let response;
    if(!userResults.Count){
        response = new Response(404, "No such user");
    }else{
        response = new Response(200, JSON.stringify(userResults.Items));
    }
    return response;
}