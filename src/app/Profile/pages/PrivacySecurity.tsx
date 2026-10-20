import { Database, KeyRound, Lock, Bot, Smartphone, UserCheck } from "lucide-react";
import { ProfileSubpage, InfoSection } from "../components/ProfileSubpage";

export function PrivacySecurity() {
  return (
    <ProfileSubpage title="Privacidade e Segurança">
      <p className="type-caption text-neutral-400 px-1">
        O Renvest é um projeto acadêmico de educação financeira. Coletamos apenas o necessário para você
        acessar a plataforma e acompanhar seu progresso na trilha.
      </p>

      <InfoSection icon={Database} iconClassName="text-sky-400" title="Quais dados guardamos">
        <ul className="list-disc pl-4 space-y-1">
          <li>Nome e e-mail informados no cadastro (ou fornecidos pelo Google, no login social).</li>
          <li>Lições concluídas, tentativas e notas dos testes de cada módulo.</li>
          <li>Os dias em que você estudou, usados para calcular sua ofensiva.</li>
        </ul>
        <p>Não pedimos CPF, dados bancários nem informações sobre seus investimentos reais.</p>
      </InfoSection>

      <InfoSection icon={KeyRound} iconClassName="text-amber-400" title="Senha e login">
        <p>
          Sua senha nunca é armazenada em texto puro: ela é protegida com <strong>bcrypt</strong>, um
          algoritmo de hash com salt. Nem mesmo a equipe do projeto consegue lê-la.
        </p>
        <p>
          Se preferir, você pode entrar com sua conta Google. Nesse caso, o Renvest não recebe sua senha do
          Google, apenas nome, e-mail e identificador da conta.
        </p>
      </InfoSection>

      <InfoSection icon={Lock} iconClassName="text-emerald-400" title="Sessão protegida">
        <p>
          Após o login, sua sessão é mantida por um token assinado (JWT) com validade de 7 dias. Todas as
          rotas de progresso, lições e testes exigem esse token.
        </p>
        <p>Ao tocar em “Sair da Conta”, o token é apagado deste dispositivo.</p>
      </InfoSection>

      <InfoSection icon={Bot} iconClassName="text-red-light" title="Inteligência artificial">
        <p>
          As perguntas que você envia no chat são processadas por um modelo de linguagem (OpenAI) junto com
          trechos de documentos oficiais da CVM, B3, Banco Central e Tesouro Nacional. Evite incluir dados
          pessoais nas perguntas.
        </p>
        <p>
          As respostas têm caráter educativo e <strong>não são recomendação de investimento</strong>.
        </p>
      </InfoSection>

      <InfoSection icon={Smartphone} iconClassName="text-violet-400" title="Dados no seu dispositivo">
        <p>
          O navegador guarda localmente o token de sessão, seus dados básicos de perfil, o mascote escolhido
          como avatar e se você já viu a apresentação inicial. Limpar os dados do site remove essas
          informações.
        </p>
      </InfoSection>

      <InfoSection icon={UserCheck} iconClassName="text-sky-300" title="Seus direitos">
        <p>
          Em linha com a LGPD, você pode solicitar a consulta, correção ou exclusão dos seus dados a qualquer
          momento entrando em contato com o responsável pelo projeto.
        </p>
      </InfoSection>
    </ProfileSubpage>
  );
}
