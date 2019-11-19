const AWS = require("aws-sdk");
const Constants = require("./Constants");
const s3 = new AWS.S3();



const utils = {
    examIntentResponse: (course, responseType) => {
        const params = {
            Bucket: "etc-bucket-a01021558",
            Key: "exam_schedule.json"
        };
        
        if (Constants.courseMap[course] == null) {
            return handlerInput.responseBuilder
                .speak(`There is no exam scheduled for ${course}.`)
                .getResponse();
        }

        return new Promise((resolve, reject) => {
            s3.getObject(params, (err, data) => {
                if (err) reject(err);

                const masterSchedule = JSON.parse(data.Body.toString("utf-8"));
                const courseSchedule = masterSchedule["exams"][Constants.courseMap[course]];
                
                if (responseType === "schedule")
                    resolve(`The exam time for ${course} is scheduled for ${courseSchedule.time} on ${courseSchedule.date}.`);
                else if (responseType === "location")
                    resolve(`The exam for ${course} is located in ${courseSchedule.building}.`);
            });
        });
    }
};

module.exports = utils;
