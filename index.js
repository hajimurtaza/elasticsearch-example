const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({hosts:['http://localhost:9200']});
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cities = require('cities.json');

console.log(cities[10000]);

client.ping({
  requestTimeout: 3000,
}, function(error){
  if(error){
    console.log("elastic search is not working");
  }
  else{
    console.log("elastic search is working");
  }
});

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3001);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.sendFile('template.html', {
    root: path.join(__dirname, 'views')
  });
})

app.get('/search', function (req, res) {
  // declare the query object to search elastic search and return only 200 results from the first result found. 
  // also match any data where the name is like the query string sent in
  let body = {
    size: 200,
    from: 0,
    query: {
      match: {
        name: req.query['q']
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({ index: 'city-table', body: body, type: 'cities_list' })
    .then(results => {
      res.send(results.hits.hits);
    })
    .catch(err => {
      console.log(err)
      res.send([]);
    });
  });

app.listen( app.get('port'), ()=>{
  console.log('express is running on port ' + app.get('port')); 
});
