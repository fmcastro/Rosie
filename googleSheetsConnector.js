


var Spreadsheet = require('edit-google-spreadsheet');

var _spreadsheet = null;

var _rows = null;

var lastRow = -1;

var _openCallback;

function sheetReady(err, spreadsheet) {
    if (err) throw err;
    
    _spreadsheet = spreadsheet;
    
    _spreadsheet.receive(sheetRead);
}

function sheetRead(err, rows, info)
{
    if (err) throw err;
    
    lastRow = info.lastRow;
    
    _rows = rows;

    if (typeof _openCallback == 'function') {
        _openCallback();
    }
}

function _setRow(rowIndex, rowData) 
{

    //var test = { [ rowindex]: "teste" };
    var row = {};
    
    row[rowIndex] = [rowData];
    
    //row.push({ [rowIndex]: rowData });
    
    console.log("ROW: " + JSON.stringify(row));
    
    _spreadsheet.add(row);
}



module.exports = {

    open: function (spreadsheetId, worksheetId, oauth, callback) 
    {
        _openCallback = callback;

        Spreadsheet.load(
            {
                debug: true,
                spreadsheetId: spreadsheetId,
                worksheetId: worksheetId,
                oauth : oauth
            },
            sheetReady);
    },

    //appends a row to de end of the sheet using a simple array of objects as the content.
    appendRow: function (rowDataArray, callback) 
    {
        _setRow(++lastRow, rowDataArray);
        
        _spreadsheet.send(callback);
        /*
        _spreadsheet.send(function (err) {
            if (err) throw err;
            console.log("Row append complete");
        });
         */
    },

    setRow: _setRow,

    getRowByColumnValue: function (columnIndex, value, directionForward)
    {
        var propArray = Object.getOwnPropertyNames(_rows);  

        if (arguments.length == 3 && arguments[2] === false) {
                realStartIndex = propArray.length - 1;

            for (var i = realStartIndex; i > 0; i--) {
                if (_rows[propArray[i]][columnIndex] == value)
                    return _rows[propArray[i]];
            }
        }
        else {
            realStartIndex = 0;

            for (var i = realStartIndex; i < propArray.length; i++) {
                if (_rows[propArray[i]][columnIndex] == value)
                    return _rows[propArray[i]];
            }
        }

        return null;
        
    }
}
