const AWS = require("aws-sdk");
const Alexa = require("ask-sdk-core");
const s3 = new AWS.S3();

//Room ID maps to the index in the rooms array in the schedule.json file
//Need whitespace for cases where slot value has whitespace
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
    "312": 10,
    "130 D": 0,
    "130 E": 1,
    "130 F": 2,
    "130 G": 3,
    "130 H": 4,
    "130 I": 5,
};

const handler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
        && Alexa.getIntentName(handlerInput.requestEnvelope) === "StudyRoomScheduleIntent";
    },

    async handle(handlerInput) {
        const params = {
            Bucket: "etc-bucket-a01021558",
            Key: "schedule.json"
        };

        const roomId = Alexa.getSlotValue(handlerInput.requestEnvelope, "StudyRoom");
        
        if (roomMap[roomId] == null) {
            return handlerInput.responseBuilder
                .speak("That is not a valid room ID.")
                .getResponse();
        }

        const roomSchedule = () => {
            return new Promise((resolve, reject) => {
                s3.getObject(params, (err, data) => {
                    if (err) reject(err);

                    const masterSchedule = JSON.parse(data.Body.toString("utf-8"));
                    const roomSchedule = masterSchedule["rooms"][roomMap[roomId]];

                    if (roomSchedule["booked_hours"].length > 0) {
                        let response = `Room ${roomId} is booked from `;
                        roomSchedule["booked_hours"].forEach(hour => {
                          response += hour.replace(/-/, "to") + ", "; 
                        });
                        resolve(response);
                    } else {
                        resolve(`Room ${roomId} is unbooked for the whole day.`);
                    }
                });
            });
        };
        
        return handlerInput.responseBuilder
            .speak(await roomSchedule())
            .getResponse();
    }
};

module.exports = handler;
