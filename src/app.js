const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const extrairNomeDaFuncaoAdicionarExport = require('./functions/extrairNomeDaFuncaoAdicionarExport');
const writeFile = require('./functions/writeFile');
const executarTeste = require('./functions/executarTeste');

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/criar', async (req, res) => {
    const { stringParam, testPath } = req.body;

    const jestCommand = `npx jest --testPathPattern=/Subprogramas/${testPath}`;
    const tempFilePath = `./src/temp/arquivo_temporario.js`;
    const scriptModule = extrairNomeDaFuncaoAdicionarExport(stringParam);

    if (scriptModule != null) {
        try {
            await writeFile(tempFilePath, scriptModule);
            
            console.log("Iniciando teste");
            const result = await executarTeste(jestCommand, tempFilePath);
          
            console.log(`Está correto?: ${result.isCorreto}`)
            
            res.status(200).json({ message: result });
        } catch (result) {
            console.log(`Saida do console: ${result.saida}`)
            const expectedAndRecived = await sirius(result.saida);
            res.status(500).json({ message: 'Erro ao executar o teste', saida: expectedAndRecived });
        }
    } else {
        res.status(400).json({ message: 'Definição de função inválida' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

async function sirius(text){
    const filteredLines = text.match(/(Expected:|Received:)\s+\d+/g);

    return ({expected: filteredLines[0], recived: filteredLines[1]})
}