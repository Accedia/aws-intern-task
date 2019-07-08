const AWS = require('aws-sdk');

AWS.config.update(
    {
        region: 'us-east-2'
    }
);

exports.handler = async (event) => {    
    const ddb = new AWS.DynamoDB();    
    const params = 
    {
        "TableName" : "Users"
    };

    console.log("Fetching all users from db...");
    let result;
    
    try
    {
        result ={
            statusCode: 200,
            body: (await ddb.scan(params).promise()).Items
        } 
        
        for(let value in result.body){
            result.body[value] = result.body[value];
        }
        result.body = JSON.stringify(result.body);
    }
    catch(err)
    {
        result = {
            statusCode: 400,
            body: err.message
        }
    }

    return result;    
};
    
