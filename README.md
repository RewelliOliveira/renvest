# Renvest — Frontend

> Interface web gamificada de educação financeira para investidores iniciantes.
> Trabalho de Conclusão de Curso em Engenharia de Software – UFC Quixadá.

O usuário percorre uma **trilha de missões** (no estilo Duolingo) guiado pelo mascote **Rev**, um tutor que responde dúvidas com base em fontes oficiais brasileiras (BCB, CVM, B3, FGC) por meio da API RAG do projeto [`rag-finance-agent`](https://github.com/RewelliOliveira/rag-finance-agent).

## Funcionalidades

- **Autenticação**: cadastro e login com e-mail/senha ou Google (OAuth); sessão via JWT com logout automático quando o token expira.
- **Onboarding**: apresentação do Rev exibida apenas no primeiro acesso, com conteúdo servido pela API (`/api/steps`).
- **Trilha de aprendizado**: módulos com lições, quizzes, baús de recompensa e desafio final.
- **Missão**: slides explicativos, chat com o Rev para tirar dúvidas e quiz com explicação e fonte oficial de cada resposta.
- **Chat livre**: conversa com o Rev com histórico, sugestões dinâmicas de perguntas e card com a fonte oficial consultada.
- **Perfil**: dados do usuário e saída da conta.

## Stack

| Camada | Tecnologia |
| :--- | :--- |
| UI | React 19, TypeScript, Tailwind CSS 4, Base UI, Motion, Lucide |
| Roteamento | React Router 7 (páginas carregadas sob demanda com `React.lazy`) |
| Build | Vite 8 |
| Autenticação Google | `@react-oauth/google` |
| Deploy | Docker (build multi-stage + Nginx) ou Vercel |

## Estrutura

```
src/
├── app/                    # Funcionalidades organizadas por domínio
│   ├── AuthLogin/          # Login, cadastro, contexto de sessão e hooks de autenticação
│   ├── Chat/               # Chat livre e fluxo de missão (slides, chat e quiz)
│   ├── Home/               # Onboarding inicial
│   ├── Profile/            # Perfil do usuário
│   └── Trail/              # Trilha de módulos e missões
├── assets/                 # Ícones SVG e imagens dos mascotes
├── components/ui/          # Componentes visuais reutilizáveis
├── lib/                    # Cliente HTTP da API, onboarding e utilitários
└── routes/                 # Rotas públicas e privadas
```

## Pré-requisitos

- Node.js 20+
- Backend [`rag-finance-agent`](https://github.com/RewelliOliveira/rag-finance-agent) rodando (padrão: `http://localhost:8000`)
- Um OAuth Client ID do Google Cloud Console (para o login com Google)

## Configuração

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

| Variável | Descrição |
| :--- | :--- |
| `VITE_API_URL` | URL base da API do backend (ex: `http://localhost:8000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID do Google. Deve ser o mesmo `GOOGLE_CLIENT_ID` configurado no backend |

> O Client ID do Google é público por natureza (fica embutido no JavaScript do navegador). Proteja-o cadastrando no Google Cloud Console apenas as **Authorized JavaScript origins** reais (ex: `http://localhost:5173` e o domínio de produção). Nunca coloque o `client_secret` no frontend.

## Executando

```bash
npm ci          # instala as dependências
npm run dev     # servidor de desenvolvimento em http://localhost:5173
npm run build   # checagem de tipos + build de produção em dist/
npm run lint    # ESLint
npm run preview # serve o build de produção localmente
```

## Docker

O `Dockerfile` gera o build com Vite e serve os arquivos estáticos com Nginx (com fallback de rotas para a SPA). As variáveis `VITE_*` são embutidas no momento do build, por isso são passadas como build args:

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:8000/api \
  --build-arg VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com \
  -t renvest-frontend .
docker run -p 3000:80 renvest-frontend
```

Para subir frontend e backend juntos, use o `docker-compose.yml` da pasta raiz do projeto.
