var AWS = require('aws-sdk');
var Joi = require('joi');

AWS.config.update({region: 'us-east-2'});

exports.handler = async (event) => {    
    var ddb = new AWS.DynamoDB();    
    var params = {
        "TableName" : "Users"
    };
    console.log("Fetching all users from db...");
    var result;
    
    try{
        result = await ddb.scan(params).promise();
        result = result.Items
        
    }catch(err){
        result = err.message;
    }

    return result;    
};
    