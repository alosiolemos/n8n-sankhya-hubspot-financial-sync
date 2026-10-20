# Validação

Verifiquei a estrutura do JSON, os destinos das conexões, a ausência de referências a credenciais, o estado inativo e a desativação das integrações. Os testes de JavaScript utilizam dados fictícios.

- [Script reproduzível](../tests/validar-codigo.cjs)
- [Resultados](../tests/resultados-testes.json)

Não houve importação no n8n, chamadas de API, consulta a contas Gmail, SQL executado no ERP, envio de mensagem ou criação/alteração de registros reais. A validação local não demonstra desempenho, integridade em produção ou comportamento de todos os nós do n8n.

Os tempos mencionados no contexto refletem minha experiência operacional, sem benchmark ou logs publicados nesta versão.
