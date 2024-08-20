const express = require('express');
const router = express.Router();

const { MongoClient } = require("mongodb");
const Twig = require("twig");

const uri = "mongodb://localhost:27117";
const client = new MongoClient(uri);

const database = client.db('biblular');
const versesdb = database.collection('verses');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// /* Show results */
// router.get('/results', function(req, res) {

// });

/* POST */
router.post('/', function(req, res) {
  const s = req.body.s;
  const s_arr = s.split(' ');

  let nInTheBible = 0;

  Promise.all(s_arr.map(async (s) => {

    let word = s.replace(/\W/g, '');

    return await versesdb.findOne({text: {$regex: word}})
      .then(res => { return [res, word] })
  }))
  .then(results => {
    for(let result of results) {
      if(result[0])
        nInTheBible++;
    }
    return results;
  })
  .then(results => {
    // console.log(nInTheBible)
    // res.send(`${nInTheBible} of those words are in the bible.`)

    console.log([nInTheBible, results, s])

    let nNotInTheBible = results.length - nInTheBible;

    res.render('result.twig', {nInTheBible, nNotInTheBible, results, s});
  });
});

module.exports = router;
