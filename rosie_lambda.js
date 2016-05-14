var babyLogger = require('./babyLogger.js');

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);


        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("BabyLogger" === intentName) {
        saveBabyLog(intent, session, callback);
    } else if ("WhatsMyColorIntent" === intentName) {
        getColorFromSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Baby Logger. " +
        "Please choose a valid log type by saying Log Milk, Log Medicine or Log Diaper";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me which type of log would you like to save by saying, " +
        "Log Milk, Log Medicine or Log Diaper";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using Baby Logger. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Saves information to log
 */
function saveBabyLog(intent, session, callback) {
    var cardTitle = intent.name;
    var logTypeSlot = intent.slots.LogType;
    var repromptText = "Please choose a valid log type by saying Log Milk, Log Medicine or Log Diaper";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    
    var logType = getLogType(intent, session);

    if (logType) {
        if(logType === "milk")
            saveMilkLog(intent, session, callback);
        else if(logType === "medicine")
            saveMedicineLog(intent, session, callback);
        else if(logType === "diaper") 
            saveDiaperLog(intent, session, callback);
        else
            throw "Invalid Log Type";
            
        
    } else {
        speechOutput = "Plase choose a valid log type by saying Log Milk, Log Medicine or Log Diaper";
        repromptText = "Plase choose a valid log type by saying Log Milk, Log Medicine or Log Diaper";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getLogType(intent, session)
{
    if(session.attributes)
        if(session.attributes.logType)
            return session.attributes.logType;
            
    if(intent)
        if(intent.slots)
            if(intent.slots.milkAmmount.value)
                return "milk";
            else
                return intent.slots.logType.value;
        
    return null;
}

function saveMilkLog(intent, session, callback) {
    
    var startTime = null;
    var milkAmmount = null;
    var confirmationPrompt = null;
    var sessionAttributes;
    var speechOutput;
    var cardTitle = "BabyLogger";
    var repromptText = "";
    var shouldEndSession = false;
    
    startTime = getParameterValue("startTime", intent, session);
        
    milkAmmount = getParameterValue("milkAmmount", intent, session);
    
    confirmationPrompt = getParameterValue("confirmationPrompt", intent, session);
    
    //validate milkAmmount
    milkAmmount = Number.parseInt(milkAmmount);
    
    if(isNaN(milkAmmount) || milkAmmount < 0 || milkAmmount > 999)
        milkAmmount = null;
    
    
    console.log("StartTime: " + startTime + " | milkAmmount: " + milkAmmount + " | confirmationPrompt: " + confirmationPrompt);
    
    //check if there's already a milk log open, if there is, offer to complete fields. If not, start a new one
    if(startTime !== null || milkAmmount !== null || confirmationPrompt !== null)
    {
        if(milkAmmount !== null)
        {
            if(startTime !== null)
            {
                if(confirmationPrompt !== null)
                {
                    if(confirmationPrompt === "yes")
                    {
                        //SAVE LOG
                        shouldEndSession = true;
                        speechOutput = "Log saved";
                    }
                    else if(confirmationPrompt === "no")
                    {
                        shouldEndSession = true;
                        speechOutput = "Log canceled";
                    }
                    else
                        //ask again for confirmation
                        speechOutput = "Baby Logger logging " + milkAmmount + " milliliters of milk on " + startTime + ". Please confirm by saying Yes or No";
                }
                else
                {
                    //ask again for confirmation
                    speechOutput = "Baby Logger logging " + milkAmmount + " milliliters of milk on " + startTime + ". Please confirm by saying Yes or No";
                }
            }
            else
            {
                //startTime is null but quantity isnt. 
                startTime = getCurrentTime();
                
                speechOutput = "Baby Logger logging " + milkAmmount + " milliliters of milk on " + startTime + ". Please confirm by saying Yes or No";
            }

        }
        else
        {
            //session has already started but milk ammount is still unknown
            sessionAttributes = session.attributes;
          
            speechOutput = "There's already a log started. How much milk would you like to log?";
        }
    }
    else
    {
        //new session starting
        startTime = getCurrentTime(-7);

        speechOutput = "Milk considering start time at " + startTime + ". How much milk would you like to log?.";
    }
    
    sessionAttributes = createMilkLogAttributes(startTime, milkAmmount);
    
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getParameterValue(name, intent, session)
{
    if(session)
        if(session.attributes)
            if(session.attributes[name])
                return session.attributes[name];
            
    if(intent.slots[name])
        if(intent.slots[name].value !== null && intent.slots[name].value !== undefined)
            return intent.slots[name].value;
            
    return null;
}

function createMilkLogAttributes(startTime, milkAmmount) {
    return {
        logType: "milk",
        startTime: startTime,
        milkAmmount: milkAmmount
    };
}

function getCurrentTime(offsetMinutes)
{
    var currentDate = new Date(Date.now());
    
    if(offsetMinutes !== undefined && offsetMinutes !== null)
        currentDate.setUTCMinutes(currentDate.getUTCMinutes() + offsetMinutes);
    
    var currentMinutes = currentDate.getUTCMinutes();
    
    var currentHour = currentDate.getUTCHours() - 3;
    
    
    
    return currentHour + ":" + currentMinutes;
}



// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

