const express = require('express');
const router = express.Router();

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27117";
const client = new MongoClient(uri);

const database = client.db('biblular');
const versesdb = database.collection('verses');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST */
router.post('/', function(req, res) {
  const s = req.body.s;
  const s_arr = s.split(' ');

  let count = 0;

  Promise.all(s_arr.map(async (s) => {

    let word = s.replace(/\W/g, '');

    return await versesdb.findOne({text: {$regex: word}})
      .then(res => { return [res, word] })
  }))
  .then(results => {
    for(let result of results) {
      if(result[0]) {
        count++;
        console.log('"' + result[1] + '"' + " is in the bible")
      } else {
        console.log('"' + result[1] + '"' + " is not in the bible")
      }
    }
  })
  .then(_ => {
    // console.log(count)
    res.send(`${count} of those words are in the bible.`)
  });  
});

module.exports = router;
