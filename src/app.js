const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 3000;

function extrairNomeDaFuncao(definicaoDaFuncao) {

    const regex = /function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/;
    const match = definicaoDaFuncao.match(regex);

    if (match && match.length >= 2) {
        return (`${definicaoDaFuncao}\n\nmodule.exports = ${match[1]}`)
    } else {
        return null;
    }
}

function apagarArquivoTemporario(path) {
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Arquivo apagado com sucesso');
        }
    });
}

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/criar', (req, res) => {
    const { stringParam, testPath } = req.body; // Suponha que você está enviando a string no corpo da solicitação JSON

    const jestCommand = `npx jest --testPathPattern=/Subprogramas/${testPath}`;

    const tempFilePath = `./src/temp/arquivo_temporario.js`;

    const scriptModule = extrairNomeDaFuncao(stringParam);

    if (scriptModule != null) {
        fs.writeFile(tempFilePath, scriptModule, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Erro ao criar o arquivo' });
            } else {
                console.log('Arquivo criado com sucesso');

                // Executar o comando 'npm test'
                setTimeout(() => {
                    console.log("iniciando teste")
                    exec(jestCommand, (error, stdout, stderr) => {
                        if (error) {
                            // O comando falhou
                            console.log("Codigo não passou nos testes :(")
                            apagarArquivoTemporario(tempFilePath);
                            res.status(500).json({ message: stderr });
                            console.log(error)
                        } else {
                            // O comando foi bem-sucedido
                            apagarArquivoTemporario(tempFilePath);
                            console.log(`Enviando ${stringParam} para o banco de dados :)`)
                            res.status(200).json({ message: "Seu codigo passou nos testes realizados." });
                        }
                    });    
                }, 5000);
                
            }
        });





    }

    // console.log("requisição recebida: " + stringParam)

});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});