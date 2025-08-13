# Guia de Instalação e Comentários do Projeto

## Instruções Básicas para Subir o Frontend

1.  Navegue até o diretório `frontend/`:
    ```bash
    cd frontend
    ```

2.  Crie um arquivo `.env` na raiz do `frontend/` e configure as variáveis de ambiente necessárias (se aplicável, ainda não uso).

3.  Instale as dependências:
    ```bash
    npm install
    ```

4.  Rode o projeto localmente:
    ```bash
    npm run dev
    ```

---

## Instruções Básicas para Subir o Backend

1.  Navegue até o diretório `backend/`:
    ```bash
    cd backend
    ```

2.  Crie um arquivo `.env` na raiz do `backend/`, copiando o `.env.example` e preenchendo as variáveis, especialmente `JWT_SECRET` e as de conexão com o banco.

3.  Instale as dependências:
    ```bash
    npm install
    ```

4.  Rode o servidor backend:
    ```bash
    node server.js
    ```

---

## Instrução para Subir o Banco de Dados com Docker

Certifique-se de estar na raiz do projeto onde está o arquivo `docker-compose.yml`.

1.  **Para iniciar o container pela primeira vez ou normalmente:**
    ```bash
    docker-compose up -d
    ```
    O banco será iniciado na porta 5432 e populado com os dados do `init.sql`.

2.  **Para forçar a recriação do banco de dados (útil em desenvolvimento):**
    Este comando para os contêineres e remove os volumes de dados, garantindo um início limpo.
    ```bash
    docker-compose down -v
    ```

---

## Decisão da Arquitetura Utilizada

> Optei por separar as responsabilidades do Frontend e do Backend para garantir alta coesão, baixo acoplamento e facilitar a manutenção e escalabilidade.
>
> -   **Frontend**: Aplicação cliente em **Vue.js (usando a sintaxe do Vuetify 2)** + Vite. A estrutura é modular, com separação clara entre componentes, layouts, serviços (autenticação) e configuração de rotas, facilitando a leitura e manutenção.
> -   **Backend**: API RESTful em Node.js + Express, onde reside toda a lógica de negócio, comunicação com o banco de dados e segurança da aplicação.
> -   **Banco de Dados**: PostgreSQL, orquestrado via Docker e Docker Compose para garantir um ambiente de desenvolvimento consistente e de fácil configuração inicial.
> -   **Separação de Dependências**: Cada ambiente (`frontend` e `backend`) possui seu próprio `package.json`, mantendo as dependências completamente isoladas.

---

## Funcionalidades Implementadas

O projeto inicial foi significativamente aprimorado com as seguintes funcionalidades:

* **Paginação e Busca no Servidor:** A listagem de alunos é totalmente controlada pelo back-end, garantindo alta performance mesmo com grandes volumes de dados.
* **Validação de Dados Completa (Full-Stack):**
    * **Front-end:** Validações em tempo real para melhorar a experiência do usuário, incluindo máscaras e filtros de entrada (campos numéricos, CPF formatado).
    * **Back-end:** Validação de segurança na API usando `jsonschema` para garantir a integridade dos dados, além de validações de regras de negócio (ex: CPF matematicamente válido).
* **Sistema de Autenticação e Segurança (JWT):**
    * Implementação de um fluxo completo de registo e login com senhas encriptadas (`bcryptjs`).
    * Proteção de todas as rotas de dados (CRUD de alunos) usando JSON Web Tokens (JWT), garantindo que apenas usuários autenticados possam aceder ou modificar informações.
* **Tratamento de Erros Centralizado:** O back-end possui um middleware que captura erros de forma centralizada, provendo respostas de erro consistentes e tornando o código dos controllers mais limpo e focado na lógica de negócio.

---

## Lista de Bibliotecas de Terceiros Utilizadas

> #### Para o BACKEND:
>
> -   `express`: Framework web para Node.js.
> -   `pg`: Driver do PostgreSQL para Node.js.
> -   `cors`: Middleware para habilitar o Cross-Origin Resource Sharing.
> -   `dotenv`: Para gerir variáveis de ambiente.
> -   `jsonwebtoken`: Para criar e verificar tokens JWT.
> -   `bcryptjs`: Para encriptação de senhas.
> -   `express-async-handler`: Para simplificar o tratamento de erros em rotas assíncronas.

> #### Para o FRONTEND:
>
> -   `vue` & `vue-router`: Core do framework e sistema de rotas.
> -   `vuetify`: Biblioteca de componentes de UI (configurada para V2).
> -   `axios`: Cliente HTTP para comunicação com a API.
> -   `cpf-cnpj-validator`: Para validação matemática de CPF no front-end.
> -   `vite`: Ferramenta de build e servidor de desenvolvimento.

---

## O que foi Entregue e Próximos Passos

* **Requisitos Entregues:**
    * CRUD completo de alunos.
    * Paginação e busca.
    * **Segurança da aplicação (Autenticação)**.
    * Validação de dados.

* **Possíveis Melhorias Futuras:**
    * Implementação de **testes de unidade e de integração** para garantir a qualidade e estabilidade do código.
    * Expansão do sistema de segurança para incluir **Autorização** (diferentes perfis de usuário, como 'admin' vs. 'usuário comum', com permissões distintas).
    * Melhoria da exibição de dados sensíveis na UI (ex: mascarar parte do CPF com `***`).