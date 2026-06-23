const { readFileSync } = require('fs');

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

// NOVA CLASSE DE SERVIÇO
class ServicoCalculoFatura {

  calcularTotalApresentacao(pecas, apre) {
    const peca = getPeca(pecas, apre);
    let total = 0;
    switch (peca.tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
         total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
  }

  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") 
       creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  }

  calcularTotalFatura(pecas, apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      // Uso do "this." para chamar outro método da mesma classe
      total += this.calcularTotalApresentacao(pecas, apre);
    }
    return total;
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      // Uso do "this." para chamar outro método da mesma classe
      creditos += this.calcularCredito(pecas, apre);
    }
    return creditos;
  }
}

// A função agora recebe o objeto "calc"
function gerarFaturaStr(fatura, pecas, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
      // Chamada dos métodos através do objeto "calc"
      faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

// Função HTML comentada temporariamente para simplificar a saída
/*
function gerarFaturaHTML(fatura, pecas, calc) {
  let faturaHTML = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;
  for (let apre of fatura.apresentacoes) {
      faturaHTML += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>\n`;
  }
  faturaHTML += `</ul>\n`;
  faturaHTML += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
  faturaHTML += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`;
  faturaHTML += `</html>\n`;
  return faturaHTML;
}
*/

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Instanciando a classe e passando para a função
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);

console.log(faturaStr);