const AWS = require("aws-sdk");
const Alexa = require("ask-sdk-core");
const s3 = new AWS.S3();
let skill;

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

const launchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
    },

    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Opening B.C.I.T pal!")
            .reprompt("You can ask for a study room schedule, exam schedule for a course, or ask for a u-pass renewal.")
            .getResponse();
    }
};

const studyRoomScheduleIntentHandler = {
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
        const roomSchedule = () => {
            return new Promise((resolve, reject) => {
                s3.getObject(params, (err, data) => {
                    if (err) reject(err);

                    const masterSchedule = JSON.parse(data.Body.toString("utf-8"));
                    const roomSchedule = masterSchedule["rooms"][roomMap[roomId]];

                    if (roomSchedule.length > 0) {
                        let response = `Room ${roomId} is booked from `;
                        roomSchedule.booked_hours.forEach(hour => {
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

const errorHandler = {
    canHandle() {
        return true;
    },

    handle(handlerInput, error) {
        console.log(`Error: ${error.message}`);
        return handlerInput.responseBuilder
            .speak("Sorry, I do not understand the command. Please say again.")
            .reprompt("Sorry, I do not understand the command. Please say again.")
            .getResponse();
    }
};

exports.handler = async (event, context, callback) => {
    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
                launchRequestHandler,
                studyRoomScheduleIntentHandler
            )
            .addErrorHandlers(errorHandler)
            .create();
    }

    const response = await skill.invoke(event, context);
    return response;
};
