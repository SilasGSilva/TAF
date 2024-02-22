'use strict';

const fs = require('fs')
fs.readFile('./appConfig.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }

    let proAppConfig = JSON.parse(jsonString);

    proAppConfig.tafVersion = process.argv[2];
    
    jsonString = JSON.stringify(proAppConfig); 

    fs.writeFile('./appConfig.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote version')
        }
    })
})