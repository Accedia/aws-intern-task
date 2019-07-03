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
    
    var avatars = [];
    try{
        var users = (await ddb.scan(params).promise()).Items;
        
        for(let i = 0; i < users.length; i++){
            let data = await s3.getObject({
                Bucket: srcBucket,
                Key: users[i].username.S
            }).promise();
            console.log(data.Body);
            avatars[i] = data.Body.toString('base64');
        }        
    }catch(err){
        avatars = err.message;
    }
    console.log(avatars);
    return avatars;

};
    