const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-2" });
const s3 = new AWS.S3();
const srcBucket = "accedia-users-avatars";
const table = "Users";
const ddb = new AWS.DynamoDB();
const Joi = require('joi');
exports.handler = async(event) => {
    event = JSON.parse(event.body);
    const type = event.image.split(";")[0].split("/")[1];
    const base64String = event.image.replace(/^data:image\/\w+;base64,/, "");
    const base64Data = Buffer.from(base64String, 'base64');
    const requiredSchema = Joi.object().keys( {
        username: Joi.string().alphanum().min(3).max(30).required(),
        firstName: Joi.string().alphanum(),
        lastName: Joi.string().alphanum(),
        password: Joi.string().min(3),
        email: Joi.string().email(),
        image: Joi.string()
    } );
    const isValid = requiredSchema.validate(event);
    console.log(isValid);
    if(isValid.error !== null) {
        return {
            statusCode: 406,
            body: isValid.error.message
        }
    } 
    const userWithUsername = {
        TableName: table,
        ProjectionExpression: "username",
        KeyConditionExpression: "username = :user ",
        ExpressionAttributeValues: {
            ":user": {
                S: event.username
            }
        }
    }
    const hasUser = await ddb.query(userWithUsername).promise();
    if(hasUser.Count > 0) {
        return {
            statusCode: 409,
            body: "Username in use!"
        };
    }
    const imageUpload = { 
        Bucket: srcBucket,
        Key: `${event.username}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    }
    const imageResponse = await s3.upload(imageUpload).promise();
    console.log("Avatar url created:"); 
    console.log(imageUpload.Location);
    const userToBeInserted = {
        Item: {
            "username": {
                S: event.username
            },
            "firstName": {
                S: event.firstName
            },
            "lastName": {
                S: event.lastName
            },
            "password": {
                S: event.password
            },
            "email": {
                S: event.email
            },
            "avatarUrl": {
                S: imageResponse.Location
            }
        },
        "TableName": "Users"
    };
    
    await ddb.putItem(userToBeInserted).promise();
    return {
        statusCode: 200,
        body: JSON.stringify(userToBeInserted.Item)
    };
};
