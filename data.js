const elasticSearch = require('elasticsearch')
const cities = require('cities.json')
console.log(cities[0]);
var bulk = [];
const client = new elasticSearch.Client({
  hosts:['http://localhost:9200']
});

client.ping({
  requestTimeout: 1000,
}, function(error){
  if(error){
    console.error('Elasticsearch cluster is down');
  } 
  else{
    console.log('Elasticsearch is working');
  }
});

client.indices.create({
  index: 'city-table'
}, function(error, response, status) {
  if(error){
    console.log(error);
  }
  else{
    console.log("created new index", response);
  }
});

client.index({
  index: 'city-table',
  id: '1',
  type: 'cities_list',
  body: {
    "Key1": "Content for key one",
    "Key2": "Content for key two",
    "key3": "Content for key three",
  }
}, function (err, resp, status) {
  console.log(resp);
});

cities.forEach(city => {
  bulk.push({index:{
      _index:"city-table",
      _type:"cities_list"
    }
  })
  bulk.push(city)
})

client.bulk({body:bulk}, function(error, response ){
  if (error){
    console.log("bulk insert failed".red, error);
  }
  else{
    console.log("Successfully inserted %s", cities.length);
  }
});

