const AWS = require('aws-sdk');

AWS.config.update( {region: 'us-east-2'} );

exports.handler = async (event) => {    
    const ddb = new AWS.DynamoDB();    
    const params = {
        "TableName" : "Users"
    };

    console.log("Fetching all users from db...");
    let result;
    
    try {
        result = (await ddb.scan(params).promise()).Items;
    }
    catch(err) {
        result = err.message;
    }

    return result;    
};
    
