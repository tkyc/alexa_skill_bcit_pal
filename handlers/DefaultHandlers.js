const Alexa = require("ask-sdk-core");

const handlers = {
    launchRequestHandler: {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
        },
    
        handle(handlerInput) {
            return handlerInput.responseBuilder
                .speak("Welcome to B.C.I.T pal.")
                .reprompt("You can ask for a study room schedule, exam schedule for a course, or ask for a u-pass renewal.")
                .getResponse();
        }
    },

    errorHandler: {
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
    }
};

module.exports = handlers;
