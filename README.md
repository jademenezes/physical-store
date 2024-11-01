## Desafio 2 - Physical Store backend

Repositório para o desafio 2 do Programa de Bolsas Backend Developmend - Node.js AGO/2024

## Manual do dev

### Configurações

Crie um arquivo _.env_ na raiz do projeto, seguindo o _.env-example_, e adicione:

- **Chave de API do Mapbox**: Necessária para funcionalidades de geolocalização.
- **Credenciais de conexão com o banco de dados**: Inclua nome de usuário e senha na string de conexão.

**exemplo**:

> MAPBOX_API_KEY=**Sua_chave_API**
> DATABASE=mongodb+srv://**usuário**:**senha**@servidor.mongodb.net/bancoDeDados'

## Inicializando o servidor

- Para iniciar o servidor em ambiente de desenvolvimento, execute `npm run dev` ou `npx run dev`

## Rotas

- **Lojas**

  - GET `api/v1/lojas` - Retorna uma lista de todas as lojas no banco de dados
  - POST `api/v1/lojas` - Adiciona uma loja no banco de dados

- **Loja específica**

  - PATCH `/api/v1/lojas/:id` - Atualiza dados de uma loja de determinado ID
  - DELETE `/api/v1/lojas/:id` - Delete uma loja de determinado ID do banco de dados

- **Busca por Raio**
  - GET `/api/v1/lojas/:cep` - Retorna uma lista de lojas, em ordem de mais próxima para mais distante, em um raio de 100km do CEP informado.
