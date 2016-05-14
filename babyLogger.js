
//writer must accept the contract "appendRow(dataArray)" for this to work
var writer = require('./googleSheetsConnector.js');
var googleLogin = require("./googleLogin.json");

const OPERATION_TYPE_MILK = 1;
const OPERATION_TYPE_COLUMN_INDEX = 8;

function LogData(startTime, endTime, milkAmmount, diaperContent, medicineName, notes, operationType, eventLog)
{
    this.startTime = startTime;
    this.endTime = endTime;
    this.milkAmmount = milkAmmount;
    this.diaperContent = diaperContent;
    this.medicineName = medicineName;
    this.notes = notes;
    this.operationType = notes;
    this.eventLog = eventLog;
}

LogData.prototype.toRowData = function toRowData()
{
    return [null, this.startTime, this.endTime, this.milkAmmount, this.diaperContent, this.medicineName, this.notes, this.operationType, this.eventLog];
}

LogData.prototype.fromRowData = function fromRowData(rowData)
{
    this.startTime = rowData[2];
    this.endTime = rowData[3];
    this.milkAmmount = rowData[4];
    this.diaperContent = rowData[5];
    this.medicineName = rowData[6];
    this.notes = rowData[7];
    this.operationType = rowData[8];
    this.eventLog = rowData[9];

    return this;
}

LogData.prototype.milkData = function milkData(startTime, endTime, milkAmmount, notes)
{
    this.startTime = startTime;
    this.endTime = endTime;
    this.milkAmmount = milkAmmount;
    this.diaperContent = null;
    this.medicineName = null;
    this.notes = notes;
    this.operationType = OPERATION_TYPE_MILK;
    this.eventLog = null;

    return this;
}


function appendLogData(logData, callback)
{
    writer.appendRow(logData.toRowData(), callback);
}


module.exports = {
    
    open: function(callback)
    {
        var spreadsheetId = googleLogin.spreadsheetId;
        var worksheetId = googleLogin.worksheetId;
        var oauth = {
                email: googleLogin.email,
                keyFile: googleLogin.keyFile
            }
            

        writer.open(spreadsheetId, worksheetId, oauth, callback);
    },
    
    

    logMilkStart: function(startTime, callback)
    {
        var currentTime = new Date(Date.now());
        
        if (startTime === null)
            startTime = currentTime;
        
        var logData = new LogData().milkData(startTime.toLocaleString('pt-BR'), null, null, null);

        logData.eventLog = currentTime.toLocaleString('pt-BR') + ': milkStart';
        
        appendLogData(logData, callback);
    },

    logMilkFinish: function (finishTime, milkAmmount) 
    {
        var rowData = writer.getRowByColumnValue(OPERATION_TYPE_COLUMN_INDEX, OPERATION_TYPE_MILK, false);
        
        console.log(JSON.stringify(rowData));

        if (rowData === null) 
            throw "Can't find last milk start";
        
        var logData = new LogData().fromRowData(rowData);

        console.log(JSON.stringify(logData));
    }
}
