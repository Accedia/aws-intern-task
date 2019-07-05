const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const ddb = new AWS.DynamoDB();    
exports.handler = async (event) => {    
    const params = {
        "TableName" : "Users",
        "ProjectionExpression" : "avatarUrl"
    };
    let result;
    try{
        let users = (await ddb.scan(params).promise()).Items;
        result = {
            statusCode: 200,
            body: []
        }
        for(let i = 0; i < users.length; i++){
            result.body[i] = users[i].avatarUrl.S;
        }        
    }catch(err){
        console.log(err);
        result = {
            body: "Internal server error!",
            statusCode: 500 
        }
    }
    return result;
};
    