# Match-Job

## Sobre o Projeto

O **Match-Job** é uma aplicação que realiza o pareamento entre candidatos e vagas de trabalho, utilizando inteligência artificial para calcular a compatibilidade entre as descrições de vagas e os perfis dos candidatos. O sistema é construído com **NestJS**, **OpenAI Embedding** para análise semântica, e **Pinecone** para armazenamento e recuperação dos scores de match.

---

## Funcionalidades

1. **Cadastro de Vagas e Candidatos:**
   - Criação e gerenciamento de perfis de candidatos e descrições detalhadas das vagas.

2. **Cálculo de Compatibilidade:**
   - Uso de embeddings gerados pelo OpenAI para comparar perfis e descrever similaridades.

3. **Armazenamento e Recuperação Eficiente:**
   - Utilização do Pinecone para gerenciar dados de embeddings e permitir consultas rápidas.

4. **API de Match:**
   - Endpoints para buscar o melhor candidato para uma vaga ou as melhores vagas para um candidato.

---

## Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/):** Framework para construção de APIs robustas e escaláveis.
- **[OpenAI Embedding](https://platform.openai.com/docs/guides/embeddings):** Para análise semântica e cálculo de similaridade.
- **[Pinecone](https://www.pinecone.io/):** Base de dados vetorial para armazenamento eficiente de embeddings.

---

## Como Rodar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Yarn ou NPM
- Conta configurada no OpenAI
- Instância configurada no Pinecone

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/suarexemplo/match-job.git
   cd match-job
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
     ```env
     
     OPENAI_API_KEY=your_openai_api_key
     OPENAI_ORGANIZATION=your_openai_organization
     OPENAI_PROJECT=your_openai_project
     PINECONE_API_KEY=your_pinecone_api_key
     JWT_SECRET=your_secret
     MONGODB_URI=your_uri_mongo
     ```

4. Execute as migrações do banco de dados:
   ```bash
   npm run migration:run
   # ou
   yarn migration:run
   ```

5. Inicie o servidor:
   ```bash
   npm run start:dev
   # ou
   yarn start:dev
   ```

### Testes

Execute os testes para garantir que tudo está funcionando como esperado:
```bash
npm run test
# ou
yarn test
```

---

## Endpoints Principais

### Criar uma vaga
**POST /jobs**
```json
{
	"title": "Backend Developer",
	"description": "Looking for a backend developer proficient in JavaScript and Nestjs...",
	"skills": [
		"Nestjs",
		"nodejs",
		"JavaScript"
	]
}
```

### Criar um candidato
**POST /candidates**
```json
{
	"name": "Israel Batista",
	"email": "israelbatiista19@gmail.com",
	"password": "123456",
	"skills": [
		"JavaScript",
		"Nestjs",
		"Nodejs"
	],
	"resume": "Experienced backend developer with expertise in JavaScript, Nestjs, and Node.js..."
}
```

### Buscar os melhores candidatos para uma vaga
**GET /matches/job/:jobId**






