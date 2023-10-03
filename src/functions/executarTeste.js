const { exec } = require('child_process');
const deleteFile = require('./deleteFile');

async function executarTeste(command, tempFilePath) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                deleteFile(tempFilePath);
                reject({ isCorreto: false, saida: stderr });
            } else {
                deleteFile(tempFilePath);
                resolve({ isCorreto: true, saida: stderr });
            }
        });
    });
}

module.exports = executarTeste;