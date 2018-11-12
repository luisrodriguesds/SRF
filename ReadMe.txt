SERVIDOR NODE JS

Este projeto requer que o sistema fique executando como daemon. 
-> Para parar essa execucao para fazer modificacoes ou testes, navegue
	ateh o diretorio do projeto /home/administrador/Projetos/SRF e utilize 
	o comando npm run kill_daemons.
-> Para testar o funcionamento da aplicacao utilize npm run run_test. Lembrando
	que neste modo o servico soh funciona enquanto o processo estiver executando
	no terminal.
-> Utilize npm run run_daemon para executar o servico como daemon (modo deploy).
-> npm run list_deamons mostra os servicoes que estao em execucao.


"run_test": "forever ./bin/www",
"run_daemon": "forever start ./bin/www",
"list_daemons": "forever list",
"kill_daemons": "forever stopall"

CHECAR SE MONGODB ESTÁ ATIVADO!!!! CASO CONTRÁRIO, O SISTEMA NÃO FUNCIONARÁ!!!

-> Para iniciar o mongodb digite:
sudo service mongod start
Após isso você poderá inicializar o daemon.