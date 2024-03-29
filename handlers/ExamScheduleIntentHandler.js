const Alexa = require("ask-sdk-core");
const ExamIntentUtils = require("../utils/ExamIntentUtils");



const handler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
        && Alexa.getIntentName(handlerInput.requestEnvelope) === "ExamScheduleIntent";
    },

    async handle(handlerInput) {
        const course = `${Alexa.getSlotValue(handlerInput.requestEnvelope, "Course")}` +  
                       `${Alexa.getSlotValue(handlerInput.requestEnvelope, "CourseCode")}`;

        return handlerInput.responseBuilder
            .speak(await ExamIntentUtils.examIntentResponse(course, "schedule"))
            .getResponse();
    }
};

module.exports = handler;
