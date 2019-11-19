const Alexa = require("ask-sdk-core");
const DefaultHandlers = require("./handlers/DefaultHandlers");
const StudyRoomScheduleIntentHandler = require("./handlers/StudyRoomScheduleIntentHandler");
const ExamScheduleIntentHandler = require("./handlers/ExamScheduleIntentHandler");
const ExamLocationIntentHandler = require("./handlers/ExamLocationIntentHandler");

exports.handler = async (event, context, callback) => {
    let skill;

    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
                DefaultHandlers.launchRequestHandler,
                StudyRoomScheduleIntentHandler,
                ExamScheduleIntentHandler,
                ExamLocationIntentHandler
            )
            .addErrorHandlers(DefaultHandlers.errorHandler)
            .create();
    }

    const response = await skill.invoke(event, context);
    return response;
};
