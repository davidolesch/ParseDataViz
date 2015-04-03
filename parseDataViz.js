Parse.Cloud.define("topDistinctValues", function(request, response) {
  Parse.Cloud.useMasterKey();
  var className = request.params.className;
  var numberOfDays = request.params.numberOfDays;
  var query = new Parse.Query(className);
  query.greaterThanOrEqualTo("createdAt", daysAgoDate(numberOfDays));
  var columnNames;
  var columns= {};
  var responseString = "";

  query.first(function(row) {
    if( row === undefined ) {
      response.error("No rows matching your filters found.");
    }
    else {
      // Determine the table column names.
      columnNames = Object.keys(row.attributes);
      for( var k = 0 ; k < columnNames.length ; k++ ) {
        var columnName = columnNames[k];
        columns[columnName] = {};
      }
    
      query.each(function(row) {
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
          responseString += ("There are "+ uniques.length  +" unique values for "+columnName+ ".\n");
          for( var i = 0 ; i < uniques.length && i < 10 ; i++ ) {
            responseString += (uniques[i]["count"] + " " + className  + " are " + columnName + " = " + uniques[i]["value"] + "\n");
          }
        }
      }).then(function() {
        response.success(responseString);
      });
    } 
  })
});

function daysAgoDate(numberOfDays) {
  var d = new Date();
  var timeNow = d.getTime();                       
  var timeInMs = timeNow - numberOfDays * 24 * 60 * 60 * 1000;
  var queryDate = new Date();
  queryDate.setTime(timeInMs);
  return queryDate;
}
