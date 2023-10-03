const util = require('util');
const fs = require('fs');
const writeFileAsync = util.promisify(fs.writeFile);


async function writeFile(filePath, content) {
    await writeFileAsync(filePath, content);
}

module.exports = writeFile