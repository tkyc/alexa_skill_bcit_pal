const AWS = require("aws-sdk");
const s3 = new AWS.S3();

//Room ID maps to the index in the rooms array in the schedule.json file
const roomMap = {
    "130D": 0,
    "130E": 1,
    "130F": 2,
    "130G": 3,
    "130H": 4,
    "130I": 5,
    "137": 6,
    "138": 7,
    "140": 8,
    "141": 9,
    "312": 10
};

//Handles the different request types and intent types
const requestMap = {
    "LaunchRequest": (callback, request) => { callback(null, launchSkill()); },
    "IntentRequest": (callback, request) => { callback(null, handleIntent(request.intent).then((response) => {
        buildResponse(response);
    }))}
};

//Lambda handler --- index.handler
exports.handler = async (event, context, callback) => {
    const request = event.request;
    requestMap[request.type](callback, request);
};

//Handle LaunchRequest
const launchSkill = () => {
    return buildResponse("Launching B.C.I.T pal");
};

//Handle IntentRequest
const handleIntent = (intent) => {
    if (intent.name === "ScheduleIntent") {
        const params = {
            Bucket: "etc-bucket-a01021558",
            Key: "schedule.json"
        };
        
        return new Promise((resolve, reject) => {
            s3.getObject(params, (err, data) => {
                if (err) console.log(err);
                const schedule = JSON.parse(data.Body.toString());
                const room = schedule["rooms"][roomMap[intent.slots.room.value]];
                let reply = `Room ${intent.slots.room.value} is booked from `;
                
                room.booked_hours.forEach(hour => {
                  reply += hour.replace(/-/, "to") + " "; 
                });
                
                resolve(reply);
            });
        });
    }
};

//reply - The response Alexa provides
//"Alexa ask study buddy is room 137 currently booked"
const buildResponse = (reply) => {
    let responseJson = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: reply
            },
            shouldEndSession: true
        },
        sessionAttributes: {}
    };
    return responseJson;
};
