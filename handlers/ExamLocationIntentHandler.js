const Alexa = require("ask-sdk-core");
const ExamIntentUtils = require("../utils/ExamIntentUtils");



const handler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
        && Alexa.getIntentName(handlerInput.requestEnvelope) === "ExamLocationIntent";
    },

    async handle(handlerInput) {
        const course = `${Alexa.getSlotValue(handlerInput.requestEnvelope, "Course")}` +  
                       `${Alexa.getSlotValue(handlerInput.requestEnvelope, "CourseCode")}`;

        return handlerInput.responseBuilder
            .speak(await ExamIntentUtils.examIntentResponse(course, "location"))
            .getResponse();
    }
};

module.exports = handler;
