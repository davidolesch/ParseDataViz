# ParseDataViz
ParseDataViz a collection of CloudFunctions that crawl your Parse.com data to give you insights. The first CloudFunction, called `topDistinctValues` looks at a Parse class and tells you what the distinct values are in each column sorted by the number of occurrences of each distinct value.

# Installing

Get started by adding parseDataViz.js to your `cloud` directory within your Parse CloudCode directory. Next add the line `var parseDataViz = require('cloud/parseDataViz.js');` to your `main.js` file. Finally deploy to your Parse app.

# Using

After installing you will have a new CloudFunction to play with. You can run this CloudFunction on all the Parse platforms. In Javascript it looks like:

```
Parse.Cloud.run('topDistinctValues', {"className": "Photo", "numberOfDays": "7"}, {
  success: function(result) {
    console.log(result);
  },
  error: function(error) {
   console.log(error);
  }
});
```
