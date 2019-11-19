const AWS = require("aws-sdk");
const Alexa = require("ask-sdk-core");
const Constants = require("../utils/Constants");
const s3 = new AWS.S3();



const handler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
        && Alexa.getIntentName(handlerInput.requestEnvelope) === "StudyRoomScheduleIntent";
    },

    async handle(handlerInput) {
        const params = {
            Bucket: Constants.bucket,
            Key: Constants.studyRoomSchedule
        };

        const roomId = Alexa.getSlotValue(handlerInput.requestEnvelope, "StudyRoom");
        
        if (Constants.roomMap[roomId] == null) {
            return handlerInput.responseBuilder
                .speak("That is not a valid room ID.")
                .getResponse();
        }

        const roomSchedule = () => {
            return new Promise((resolve, reject) => {
                s3.getObject(params, (err, data) => {
                    if (err) reject(err);

                    const masterSchedule = JSON.parse(data.Body.toString("utf-8"));
                    const roomSchedule = masterSchedule["rooms"][Constants.roomMap[roomId]];

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
