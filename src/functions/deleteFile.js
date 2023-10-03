const util = require('util');
const fs = require('fs');
const unlinkAsync = util.promisify(fs.unlink);

async function deleteFile(path) {
    try {
        await unlinkAsync(path);
        console.log('Arquivo apagado com sucesso');
    } catch (err) {
        console.error(err);
    }
}

module.exports = deleteFile