import type { ComponentType, SVGProps } from "react";
import { MascotHello, MascotPoint, MascotPlan } from "@/assets/icons";

export interface LearningStep {
  id: number;
  mascot: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  bubbleText: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface SourceCitation {
  document: string;
  section: string;
}

export interface QuizStep {
  id: number;
  mascot: ComponentType<SVGProps<SVGSVGElement>>;
  question: string;
  explanation: string;
  source: SourceCitation;
  options: QuizOption[];
}

export interface MissionModule {
  id: string;
  title: string;
  learningSteps: LearningStep[];
  chatSuggestions: string[];
  quizSteps: QuizStep[];
}

export const MODULE_1: MissionModule = {
  id: "modulo-1-fgc",
  title: "O Escudo do Dinheiro",
  learningSteps: [
    {
      id: 1,
      mascot: MascotHello,
      title: "O que é o FGC?",
      bubbleText:
        "Olá! Antes de qualquer investimento, você precisa saber como seu dinheiro é protegido. O FGC (Fundo Garantidor de Créditos) funciona como um seguro oficial para os seus investimentos em bancos!",
    },
    {
      id: 2,
      mascot: MascotPoint,
      title: "Qual o limite de cobertura?",
      bubbleText:
        "O FGC garante até R$ 250.000 por CPF e por instituição financeira. Existe também um teto global de R$ 1 milhão a cada período de 4 anos. Ou seja, mesmo que vários bancos quebrem, esse é o máximo que você pode recuperar.",
    },
    {
      id: 3,
      mascot: MascotPlan,
      title: "O que o FGC cobre?",
      bubbleText:
        "Poupança, CDB, LCI, LCA e RDB são cobertos pelo FGC. Já ações negociadas na B3, Fundos de Investimento e Debêntures NÃO têm essa proteção, pois são produtos de renda variável ou com patrimônio segregado.",
    },
  ],
  chatSuggestions: [
    "Poupança tem FGC?",
    "E se eu tiver dinheiro em dois bancos?",
    "Tesouro Direto tem FGC?",
    "Qual o teto global do FGC?",
    "E o Fundo de Investimento?",
  ],
  quizSteps: [
    {
      id: 1,
      mascot: MascotHello,
      question:
        "O que acontece com o seu dinheiro se o banco onde você tem um CDB quebrar?",
      explanation:
        "Exatamente! O FGC ressarce os seus depósitos até o limite de cobertura. Por isso é um seguro fundamental para investidores de renda fixa.",
      source: {
        document: "Estatuto Oficial do FGC",
        section: "Artigo 2º",
      },
      options: [
        {
          id: "a",
          text: "O FGC devolve o valor até o limite de R$ 250 mil",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Você perde todo o dinheiro sem direito a ressarcimento",
          isCorrect: false,
        },
        {
          id: "c",
          text: "O governo federal deposita o dinheiro automaticamente",
          isCorrect: false,
        },
      ],
    },
    {
      id: 2,
      mascot: MascotPoint,
      question:
        "Dilema do investidor: você tem R$ 200.000 em CDB e R$ 80.000 em Ações na B3, ambos no mesmo banco. Se o banco falir, qual o valor que o FGC vai ressarcir?",
      explanation:
        "Correto! O FGC cobre os R$ 200 mil do CDB pois está dentro do teto. As ações negociadas na B3 têm patrimônio segregado e não dependem do banco para sua proteção.",
      source: {
        document: "Regulamento do FGC",
        section: "Anexo II, Artigo 3º",
      },
      options: [
        {
          id: "a",
          text: "R$ 200.000 (apenas o CDB — ações não têm FGC)",
          isCorrect: true,
        },
        {
          id: "b",
          text: "R$ 250.000 (o teto máximo, somando tudo)",
          isCorrect: false,
        },
        {
          id: "c",
          text: "R$ 280.000 (CDB + Ações integralmente)",
          isCorrect: false,
        },
      ],
    },
    {
      id: 3,
      mascot: MascotPlan,
      question:
        "Um investidor tem R$ 300.000 em CDB no Banco Alfa. Se o banco falir, qual o valor exato que o FGC vai ressarcir?",
      explanation:
        "Na mosca! O FGC cobre até R$ 250.000 por CPF e por instituição. Os R$ 50.000 excedentes não serão ressarcidos pelo fundo.",
      source: {
        document: "Regulamento do FGC",
        section: "Anexo II, Artigo 3º",
      },
      options: [
        {
          id: "a",
          text: "R$ 300.000 (valor total aplicado)",
          isCorrect: false,
        },
        {
          id: "b",
          text: "R$ 250.000 (o teto máximo por CPF e instituição)",
          isCorrect: true,
        },
        {
          id: "c",
          text: "R$ 0 (pois passou do limite, perde tudo)",
          isCorrect: false,
        },
      ],
    },
  ],
};
