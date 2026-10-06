export function buildMockReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("poupança")) {
    return "Sim! A caderneta de Poupança é um dos produtos cobertos pelo FGC, até o limite de R$ 250.000 por CPF e por instituição.";
  }
  if (q.includes("tesouro")) {
    return "O Tesouro Direto NÃO precisa do FGC, pois é garantido diretamente pelo Governo Federal (Tesouro Nacional). É o ativo de menor risco do país!";
  }
  if (q.includes("dois bancos") || q.includes("2 bancos")) {
    return "Se você tiver dinheiro em dois bancos diferentes, o limite de R$ 250 mil se aplica separadamente a cada instituição. Caso pertençam ao mesmo conglomerado, o limite é compartilhado.";
  }
  if (q.includes("fundo")) {
    return "Fundos de Investimento NÃO são cobertos pelo FGC. O patrimônio do fundo é segregado do patrimônio do banco administrador.";
  }
  if (q.includes("teto") || q.includes("global")) {
    return "O teto global do FGC é de R$ 1.000.000 a cada período de 4 anos por CPF.";
  }
  return `Boa pergunta! Sobre "${question}": o FGC foi criado para garantir segurança e estabilidade aos depósitos em instituições financeiras.`;
}
