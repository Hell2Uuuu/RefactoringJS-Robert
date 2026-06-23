const { readFileSync } = require('fs');

function gerarFaturaStr (fatura, pecas) {
    
    function calcularTotalApresentacao(apre) {
      const peca = getPeca(apre);
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

    function getPeca(apresentacao) {
      return pecas[apresentacao.id];
    }

    // 1. NOVA FUNÇÃO EXTRAÍDA: Cálculo de créditos
    function calcularCredito(apre) {
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      return creditos;   
    }

    // 2. NOVA FUNÇÃO EXTRAÍDA: Formatação de moeda
    function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
    }

    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;
  
    for (let apre of fatura.apresentacoes) {
      const peca = getPeca(apre);                  
      let total = calcularTotalApresentacao(apre); 
  
      // Atualizado para usar a nova função calcularCredito
      creditos += calcularCredito(apre);
  
      // Atualizado para usar a nova função formatarMoeda
      faturaStr += `  ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
      totalFatura += total;
    }
    
    // Atualizado para usar a nova função formatarMoeda
    faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
  }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);