var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
var s3  = new AWS.S3();
var srcBucket = "accedia-users-avatars";
exports.handler = async (event) => {    
    var ddb = new AWS.DynamoDB();    
    var params = {
        "TableName" : "Users",
        "ProjectionExpression" : "username"
    };

    try{
        var users = (await ddb.scan(params).promise()).Items;
        
        for(let i = 0; i < users.length; i++){
            let data = await s3.getObject({
                Bucket: srcBucket,
                Key: users[i].username.S
            }).promise();
            users[i].avatar = data.Body.toString('base64');
        }        
    }catch(err){
        users = err.message;
    }
    console.log(users);
    return users;

};
    