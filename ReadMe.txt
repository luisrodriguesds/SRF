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



Problemas comuns:

- O forno não está enviando os dados e o gráfico não está mais aparecendo. O que fazer?
	- Veja se o forno está se conectando a internet, caso não esteja, reinicie-o e reinicie o modem do lsc nano também.
	- Rode seu deploy em modo de teste para ver se a rota oven/RealTime está sendo utilizada, veja o log do prompt.
- O sistema não está conseguindo enviar os comandos de ligar e desligar energia e nem motor. O que fazer?
	- Reinicie o ESP. Veja qual ip ele está se conectando. Vá nos arquivos de socketManipulator e veja o endereço ip é o mesmo endereço do esp, caso não seja, substitua as rotas.