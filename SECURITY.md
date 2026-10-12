# Relatório de análise de segurança

Este documento registra os problemas identificados durante a revisão do projeto Techstore Secrets Lab.

## Problema 1 — Credenciais do banco no código-fonte

### Local
`src/config.js`

### Problema identificado
A configuração original continha credenciais diretamente no código.

### Risco
Credenciais fixas podem ser expostas a qualquer pessoa com acesso ao repositório.

### Correção aplicada
As configurações passaram a utilizar `DB_USER` e `DB_PASSWORD`, obtidas por variáveis de ambiente.

### Justificativa
A separação entre código e configuração reduz a exposição de credenciais e facilita sua substituição.

## Problema 2 — Arquivo `.env` versionado

### Local
`.env` e `.gitignore`

### Problema identificado
O arquivo de ambiente estava incluído no controle de versão.

### Risco
Valores sensíveis podem ser publicados ou acessados por pessoas sem autorização.

### Correção aplicada
O arquivo foi removido do controle de versão e adicionado às regras do `.gitignore`. Foi criado o `.env.example` com valores fictícios.

### Justificativa
O arquivo local permanece separado do modelo de configuração compartilhado. A remoção não apaga cópias existentes no histórico Git.

## Problema 3 — Arquivo de credenciais versionado

### Local
`config/credentials.json` e `.gitignore`

### Problema identificado
O arquivo de credenciais estava incluído no repositório.

### Risco
Informações sensíveis armazenadas nesse arquivo poderiam ser expostas.

### Correção aplicada
O arquivo foi removido do controle de versão e incluído no `.gitignore`.

### Justificativa
Arquivos de credenciais não devem ser versionados. Se contiverem segredos reais já publicados, estes devem ser revogados ou substituídos.

## Problema 4 — Senhas fixas no Docker Compose

### Local
`docker-compose.yml`

### Problema identificado
A configuração original continha credenciais diretamente no arquivo.

### Risco
Senhas podem ser expostas em commits, cópias do arquivo ou registros de revisão.

### Correção aplicada
As credenciais passaram a ser obtidas por variáveis de ambiente, como `${DB_USER}`, `${DB_PASSWORD}` e `${MYSQL_ROOT_PASSWORD}`.

### Justificativa
A configuração fica separada do arquivo versionado. Em produção, recomenda-se utilizar um gerenciador de segredos apropriado.

## Problema 5 — Exposição de chave de API nos logs

### Local
`scripts/backup.js`

### Problema identificado
O script original tentava imprimir uma informação sensível durante a execução.

### Risco
Logs podem ser armazenados ou acessados por pessoas que não deveriam conhecer a chave.

### Correção aplicada
O script não imprime o valor da chave e verifica se `PAYMENT_API_KEY` está configurada.

### Justificativa
Mensagens de diagnóstico devem informar o estado da operação sem revelar segredos.

## Problema 6 — Exposição de informações internas no endpoint de saúde

### Local
`src/app.js`, endpoint `/health`

### Problema identificado
O endpoint original retornava detalhes relacionados à configuração do banco.

### Risco
Informações internas desnecessárias podem ajudar terceiros a compreender a infraestrutura da aplicação.

### Correção aplicada
O endpoint passou a retornar somente o estado da aplicação.

### Justificativa
Uma resposta mínima atende à finalidade de monitoramento com menor exposição de informações.

## Problema 7 — Verificação inadequada de credenciais no endpoint

### Local
`src/app.js`, endpoint `/config-check`

### Problema identificado
A implementação original utilizava referências inadequadas para verificar a configuração de segredos.

### Risco
A verificação podia falhar e não representar corretamente o estado das variáveis de ambiente.

### Correção aplicada
O endpoint passou a verificar a presença de `ADMIN_PASSWORD`, `PAYMENT_API_KEY` e `INTERNAL_TOKEN`, retornando apenas valores booleanos.

### Justificativa
A aplicação pode indicar se as configurações existem sem retornar seus valores.

## Problema 8 — Exposição de dados nos logs da configuração do banco

### Local
`src/database.js`

### Problema identificado
O log original exibia o nome do usuário e o nome da base de dados.

### Risco
Essas informações podem revelar detalhes internos desnecessários.

### Correção aplicada
A mensagem foi substituída por uma confirmação genérica de carregamento da configuração.

### Justificativa
Logs devem conter apenas as informações necessárias para diagnóstico e operação.

## Problema 9 — Regras insuficientes no `.gitignore`

### Local
`.gitignore`

### Problema identificado
As regras originais não cobriam adequadamente arquivos de ambiente e credenciais.

### Risco
Novos arquivos sensíveis poderiam ser adicionados acidentalmente ao repositório.

### Correção aplicada
Foram adicionadas regras para arquivos `.env`, credenciais, logs, arquivos temporários e diretórios de desenvolvimento, mantendo `.env.example` permitido.

### Justificativa
Regras de exclusão ajudam a prevenir a inclusão acidental de arquivos sensíveis, mas devem ser acompanhadas pela verificação do Git.

## Problema 10 — Ausência de exclusões específicas para o contexto Docker

### Local
`.dockerignore` e `Dockerfile`

### Problema identificado
O projeto não possuía regras específicas para excluir arquivos desnecessários ou sensíveis do contexto de construção da imagem.

### Risco
Arquivos locais, histórico Git e credenciais poderiam ser enviados ao processo de construção.

### Correção aplicada
Foi criado o `.dockerignore` para excluir arquivos de ambiente, dependências locais, histórico Git, logs e o arquivo de credenciais. O `Dockerfile` instala as dependências a partir dos arquivos de pacote e copia somente os diretórios necessários.

### Justificativa
Reduzir o contexto de construção diminui a exposição de arquivos e evita incluir conteúdo desnecessário na imagem.

## Boas práticas gerais

- Não armazenar credenciais reais no código-fonte.
- Não imprimir senhas, tokens ou chaves nos logs.
- Usar variáveis de ambiente e exemplos com valores fictícios.
- Revisar os arquivos preparados para commit.
- Rotacionar credenciais reais que tenham sido expostas.
- Utilizar gerenciadores de segredos e permissões de menor privilégio em ambientes reais.
- Validar o funcionamento da aplicação após as correções.

## Observação sobre o histórico Git

Remover um arquivo do controle de versão não apaga automaticamente versões anteriores do histórico. Se credenciais reais tiverem sido publicadas, devem ser revogadas ou substituídas. A reescrita do histórico pode ser necessária conforme o contexto.
