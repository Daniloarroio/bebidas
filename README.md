# Casa de Madeira

Aplicação Java 21 com Spring Boot e MongoDB Atlas. A URI de conexão fica no arquivo local `.env`, que não deve ser enviado ao Git.

## Executar

1. Confira se o arquivo `.env` contém `MONGODB_URI` com a URI do MongoDB Atlas.
2. No terminal, dentro desta pasta, execute `mvn -s .maven-settings.xml spring-boot:run`.
3. Abra `http://localhost:8080`.

O sistema usa o banco `casademadeira` e cria as coleções `usuarios` e `bebidas`. Os usuários são cadastrados com e-mail único e senha criptografada com BCrypt. A tela de bebidas grava os registros no MongoDB e a home consulta a coleção para montar o cardápio.

Se o Atlas recusar a conexão, confira se o endereço IP da máquina está autorizado na lista de acesso de rede do cluster.
