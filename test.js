var lambda = require("./rosie_lambda.js");

var testRequest = 
{
 "session": {
    "sessionId": "SessionId.5422239d-be58-4e57-b1b3-f983b18e47f2",
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.9d204dfd-33f7-4859-8fd0-4a033e8eacbd"
    },
    "attributes": {
      "title": "by my side"
    },
    "user": {
      "userId": "amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMNWY4AY66FUR7ILBWANIHQN73QHDXWHEZDYGEQMO67EHOYXRRNFZCIGMAKEO6NYRMAVXCGIYYN6KOMBT4KXO6P3XUCJAQH5ABFLRX6ZUSGCIFFOVB73HU4WRB4MUPUBGEQBQS4W263IV3GZKZ3FEOLE3LIL2KSXS7LYPDN2V4CL2SLETFPLCY"
    },
    "new": false
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.40d332ea-f2af-493c-8611-2a0b5f9f4c99",
    "timestamp": "2016-05-15T21:03:57Z",
    "intent": {
      "name": "SongFinderParameter",
      "slots": {
        "parameterString": {
          "name": "parameterString",
          "value": "inxs"
        }
      }
    },
    "locale": "en-US"
  },
  "version": "1.0"
}

function Context(){}

Context.prototype = {
  succeed: function(response)
  {
    console.log("Context Succeed called with response: " + response);
  },

  fail: function(response)
  {
    console.log("Context Fail called with response: " + response);
  }

}

var context = new Context();

lambda.handler(testRequest, context);

