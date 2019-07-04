const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-2" });
const s3 = new AWS.S3();
const srcBucket = "accedia-users-avatars";
exports.handler = async(event) => {
    // Some way we have to give the user through the event
    const ddb = new AWS.DynamoDB();
    const type = event.image.split(";")[0].split("/")[1];
    const base64String = event.image.replace(/^data:image\/\w+;base64,/, "");
    console.log(base64String);
    const base64Data = Buffer.from(base64String, 'base64');
    
    let params = {
        Bucket: srcBucket,
        Key: `${event.username}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    }

    let avatarUrl = await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
                if (err) { reject(err) }
                console.log('Image successfully uploaded.');
                resolve(data.Location);
        })
    });

    console.log("Avatar url created:"); 
    console.log(avatarUrl);

    params = {
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
                S: avatarUrl
            }
        },
        "TableName": "Users"
    };

    const addingUser = await new Promise((resolve, reject) => ddb.putItem(params, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log("User successfully created");
            resolve("User successfully created!");
        })
    );
    return addingUser;
};
