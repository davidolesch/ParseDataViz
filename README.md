# ParseDataViz
ParseDataViz a collection of scripts that crawl your Parse.com data to give you insights. The first script called findUniques.js looks at a Parse class and tells you what the distinct values are in each column sorted by the number of occurrences of each distinct value.


[![](http://i.imgur.com/7OZPv5o.png)](https://www.youtube.com/watch?v=T78CqsZZ_3s)

# Installing

You need to set your app's Application ID, JavaScript Key and Master Key in the keys.js file so that the script can access your Parse data. You need node.js to run these scripts. Install it using `gem install node`.

# Using

Run the script by typing `node findUniques.js`. You will be asked for the Parse class name you want to search and the number of days to search.
