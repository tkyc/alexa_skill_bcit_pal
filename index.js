const Alexa = require("ask-sdk-core");
const DefaultHandlers = require("./handlers/DefaultHandlers");
const StudyRoomScheduleIntentHandler = require("./handlers/StudyRoomScheduleIntentHandler");
const ExamScheduleIntentHandler = require("./handlers/ExamScheduleIntentHandler");
let skill;

exports.handler = async (event, context, callback) => {
    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
                DefaultHandlers.launchRequestHandler,
                StudyRoomScheduleIntentHandler,
                ExamScheduleIntentHandler
            )
            .addErrorHandlers(DefaultHandlers.errorHandler)
            .create();
    }

    const response = await skill.invoke(event, context);
    return response;
};
