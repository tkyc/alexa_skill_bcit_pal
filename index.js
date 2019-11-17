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
        return handlerInput.requestEnvelope.request.type === "LaunchRequest";
    },

    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Opening B.C.I.T pal!")
            .reprompt("You can ask for a study room schedule, exam schedule for a course, or ask for a u-pass renewal.")
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
            .speak("Sorry, I do not understand the command.")
            .reprompt("Sorry, I do not understand the command. Please say again.")
            .getResponse();
    }
};

exports.handler = async (event, context, callback) => {
    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
                launchRequestHandler,
            )
            .addErrorHandlers(errorHandler)
            .create();
    }

    const response = await skill.invoke(event, context);
    return response;
};
