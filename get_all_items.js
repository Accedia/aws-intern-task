var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

exports.handler = async (event) => {    
    var ddb = new AWS.DynamoDB();    
    var params = {
        "TableName" : "Users"
    };
    console.log("HERE");
    const result = await ddb.scan(params).promise();
    
    return result.Items;    
};
    