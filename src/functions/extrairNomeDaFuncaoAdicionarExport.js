function extrairNomeDaFuncaoAdicionarExport(definicaoDaFuncao) {
    const regex = /function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/;
    const match = definicaoDaFuncao.match(regex);

    if (match && match.length >= 2) {
        return (`${definicaoDaFuncao}\n\nmodule.exports = ${match[1]}`)
    } else {
        return null;
    }
}

module.exports = extrairNomeDaFuncaoAdicionarExport;