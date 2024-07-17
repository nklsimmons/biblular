const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27117";
const client = new MongoClient(uri);

const database = client.db('biblular');
const versesdb = database.collection('verses');

const fs = require('node:fs');

// https://github.com/kenyonbowers/Bible-JSON

let count = 0;

(async function() {
    var path = './Bible-JSON/JSON';
    let openedDir = fs.opendirSync(path)
    while(true) {
        let dirent = openedDir.readSync()
        if(dirent == null)
            break;

        let path2 = dirent.path + '/' + dirent.name
        let openedDir2 = fs.opendirSync(path2)
        while(true) {
            let dirent2 = openedDir2.readSync()
            if(dirent2 == null)
                break;

            let filepath = dirent2.path + '/' + dirent2.name
            let jsondata = fs.readFileSync(filepath, {encoding: 'utf8', flag: 'r'})
            let data = JSON.parse(jsondata)

            for(let verse of data.verses) {
                await versesdb.insertOne(verse)
            }
        }
        openedDir2.close()
    }
    openedDir.close()
})().then(_ => {
    console.log("done")
})
