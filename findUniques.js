var Parse = require("parse").Parse;
var prompt = require('prompt');
var keys = require('./keys');

Parse.initialize(keys.applicationID, keys.javaScriptKey, keys.masterKey);
Parse.Cloud.useMasterKey();

prompt.start();
prompt.get(['className', 'numberOfDays'], function (err, result) {
  var className = result.className;
  var numberOfDays = result.numberOfDays;
  var query = new Parse.Query(className);
  query.greaterThanOrEqualTo("createdAt", daysAgoDate(numberOfDays));
  var columnNames;
  var columns= {};

  query.first(function(row) {
    // Determine the table column names.
    columnNames = Object.keys(row.attributes);
    for( var k = 0 ; k < columnNames.length ; k++ ) {
      var columnName = columnNames[k];
      columns[columnName] = {};
    }
  }).then(function() {
    query.each(function(row) {
      process.stdout.write(".");
      // Then determine and count the unique values in each column.
      for( var k = 0 ; k < columnNames.length ; k++) {
        var columnName = columnNames[k];
        var value = String(row.get(columnName));

        var values = Object.keys(columns[columnName]);
        if(values.indexOf(value) == -1) {
	      columns[columnName][value] = 1;
        }
        else {
          columns[columnName][value]++;
        }
      }
    }).then(function() {
      console.log();
      // Transform the object keys/values into an array and sort it. Then print the results.
      for( var k = 0 ; k < columnNames.length ; k++) {
        var columnName = columnNames[k];
        var column = columns[columnName];
        var uniques = [];
        var values = Object.keys(column);
        for( var i = 0 ; i < values.length ; i++ ) {
          uniques[i] = {"value": values[i], "count": column[values[i]]}; 
        }
        uniques.sort(function(a,b) {
          return b.count - a.count;// Descending order.
        });
        console.log("There are "+ uniques.length  +" unique values for "+columnName+ ".");
        for( var i = 0 ; i < uniques.length && i < 10 ; i++ ) {
          console.log(uniques[i]["count"] + " " + className  + " are " + columnName + " = " + uniques[i]["value"])
        }
      }
    });
  });
});

function daysAgoDate(numberOfDays) {
  var d = new Date();
  var timeNow = d.getTime();                       
  var timeInMs = timeNow - numberOfDays * 24 * 60 * 60 * 1000;
  var queryDate = new Date();
  queryDate.setTime(timeInMs);
  return queryDate;
}
