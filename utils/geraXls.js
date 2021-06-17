const json2xls = require('json2xls');
const fs = require('fs');

const geraXml = (json) => {
    let xls = json2xls(json);
    fs.writeFileSync('data.xlsx', xls, 'binary');    
}

module.exports = geraXml;