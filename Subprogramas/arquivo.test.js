const arquivo = require('../src/temp/arquivo_temporario');

test("soma dos numeros",()=>{
    expect(arquivo(5,2)).toBe(7);
})

