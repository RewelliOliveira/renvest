import { Target, Map, Library, GraduationCap, AlertTriangle } from "lucide-react";
import { LogomarcaIcon, MascotHello } from "@/assets/icons";
import { ProfileSubpage, InfoSection } from "../components/ProfileSubpage";

const MODULES = [
  { order: 1, title: "O Escudo do Iniciante", topics: "Selic, Poupança, CDB, Tesouro Selic e garantia do FGC" },
  { order: 2, title: "Os Portões da Bolsa", topics: "Ações ON e PN, Tag Along e o Novo Mercado da B3" },
  { order: 3, title: "O Detetive do Mercado", topics: "Papel da CVM, Formulário de Referência e Fatos Relevantes" },
];

const SOURCES = ["CVM", "B3", "Banco Central", "CMN", "Tesouro Nacional"];

export function About() {
  return (
    <ProfileSubpage title="Sobre o Renvest">
      <div className="rounded-2xl bg-[#071329]/90 border border-white/10 p-5 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-red/10 rounded-full blur-2xl pointer-events-none" />
        <MascotHello className="h-24 w-auto mb-3" />
        <LogomarcaIcon className="h-7 w-auto mb-2" />
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          Educação financeira gamificada para investidores iniciantes, com o Rev como seu tutor e respostas
          baseadas em fontes oficiais brasileiras.
        </p>
      </div>

      <InfoSection icon={Target} iconClassName="text-red-light" title="Nossa missão">
        <p>
          Reduzir a distância entre o investidor iniciante e as informações do mercado de capitais. Em vez de
          respostas genéricas, o Renvest usa <strong>RAG (Retrieval-Augmented Generation)</strong>: cada
          explicação é construída a partir de trechos de documentos oficiais, e a fonte é exibida para você
          conferir.
        </p>
      </InfoSection>

      <InfoSection icon={Map} iconClassName="text-sky-400" title="A trilha">
        <p>Três módulos progressivos, cada um com lições curtas e um teste final para desbloquear o próximo:</p>
        <ol className="space-y-2 pt-1">
          {MODULES.map((module) => (
            <li key={module.order} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-lg bg-white/10 text-white text-xs font-extrabold flex items-center justify-center">
                {module.order}
              </span>
              <div>
                <p className="font-bold text-white">{module.title}</p>
                <p className="text-neutral-400">{module.topics}</p>
              </div>
            </li>
          ))}
        </ol>
      </InfoSection>

      <InfoSection icon={Library} iconClassName="text-emerald-400" title="Fontes oficiais">
        <p>A base de conhecimento reúne cadernos educacionais, resoluções e regulamentos publicados por:</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {SOURCES.map((source) => (
            <span
              key={source}
              className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400/10 border border-emerald-400/30 text-emerald-300"
            >
              {source}
            </span>
          ))}
        </div>
      </InfoSection>

      <InfoSection icon={GraduationCap} iconClassName="text-amber-400" title="Projeto acadêmico">
        <p>
          Trabalho de Conclusão de Curso em Engenharia de Software da Universidade Federal do Ceará (UFC –
          Campus Quixadá).
        </p>
        <p>
          Autor: Antonio Rewelli Oliveira dos Santos
          <br />
          Orientador: Prof. Dr. Emanuel Ferreira Coutinho
        </p>
      </InfoSection>

      <InfoSection icon={AlertTriangle} iconClassName="text-amber-300" title="Aviso importante">
        <p>
          O conteúdo do Renvest tem finalidade exclusivamente educacional e não constitui recomendação de
          investimento. Antes de investir, avalie seu perfil e consulte as fontes oficiais.
        </p>
      </InfoSection>
    </ProfileSubpage>
  );
}
