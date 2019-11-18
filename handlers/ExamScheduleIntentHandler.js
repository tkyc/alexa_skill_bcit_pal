const AWS = require("aws-sdk");
const Alexa = require("ask-sdk-core");
const s3 = new AWS.S3();

//Course name maps to the index of the course in the exam_schedule.json file
const courseMap = {
    "math3042": 0,
    "comp4968": 1,
    "comp4964": 2,
    "comp4711": 3,
    "B. law3600": 4,
    "comp4735": 5
}

const handler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
        && Alexa.getIntentName(handlerInput.requestEnvelope) === "ExamScheduleIntent";
    },

    async handle(handlerInput) {
        const params = {
            Bucket: "etc-bucket-a01021558",
            Key: "exam_schedule.json"
        };

        const course = `${Alexa.getSlotValue(handlerInput.requestEnvelope, "Course")}` +  
                       `${Alexa.getSlotValue(handlerInput.requestEnvelope, "CourseCode")}`;
        
        if (courseMap[course] == null) {
            return handlerInput.responseBuilder
                .speak(`There is no exam scheduled for ${course}.`)
                .getResponse();
        }

        const examSchedule = () => {
            return new Promise((resolve, reject) => {
                s3.getObject(params, (err, data) => {
                    if (err) reject(err);

                    const masterSchedule = JSON.parse(data.Body.toString("utf-8"));
                    const courseSchedule = masterSchedule["exams"][courseMap[course]];

                    resolve(`The exam time for ${course} is scheduled for ${courseSchedule.time}.`);
                });
            });
        };

        return handlerInput.responseBuilder
            .speak(await examSchedule())
            .getResponse();
    }
};

module.exports = handler;
