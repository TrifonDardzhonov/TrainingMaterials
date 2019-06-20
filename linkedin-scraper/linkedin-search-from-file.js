var selenium;
const fs = require('fs');

// CONFIG
var csvFilePath = "linkedinurls.csv"

exports.load = function (s) {
    selenium = s;

    return {
        openProfile: async function (personNumber) {
            var lines = fs.readFileSync(csvFilePath).toString().split('\n');
            var url = lines[personNumber];
            await selenium.navigate(url);
            await selenium.sleep(3000);
        }
    }
}