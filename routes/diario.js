var express = require('express');
var router = express.Router();


router.post('/',function(req,res){
    console.log("cheguei aqui");
    var db = req.db;
    var logTarefas = db.get('tarefasLog');
   // console.log(logTarefas.find());
    logTarefas.find({}, {sort: {_id: -1}},function (err, tarefas){ 
        if(err)
            throw(err);
        res.render('diario', {message:'no_msg',tarefas:tarefas});
    });
    //console.log(tarefas.length);
});

router.get('/',function(req,res){
    console.log("postou");
    var db = req.db;
    var logTarefas = db.get('tarefasLog');
    logTarefas.find({}, {sort: {_id: -1}},function (err, tarefas){ 
        if(err)
            throw(err);
        res.render('diario', {message:'no_msg',tarefas:tarefas});
    });
    
});
router.get('/obterTarefas', function (req,res){
    var db = req.db;
    var logTarefas = db.get('tarefasLog');
    logTarefas.find({}, {sort: {_id: -1}},function (err, tarefas){ 
        if(err)
            throw(err);
        res.send({message:'no_msg',tarefas:tarefas});
    });
});


router.post('/novaTarefa',function(req,res){
    console.log("Teste para pegar os dados");
    console.log(req.body.nome);
    let nome = req.body.nome;
    console.log(req.body.fornos);
    let forno = req.body.fornos;
    console.log(req.body.titulo);
    let titulo = req.body.titulo;
    console.log(req.body.descricao);
    let descricao = req.body.descricao;
    let data = new Date();
    var db = req.db;
    var logTarefas = db.get('tarefasLog');
    var novaTarefa = {
        "_nomeUsuario" : nome,
        "_forno" : forno,
        "_titulo" : titulo,
        "_descricao" : descricao,
        "_data" : data,
        "_status" : "0"
    }
    logTarefas.insert(novaTarefa, function(err,r){
        if(!err){
            res.send("deu certo!");
        }
        else{
            res.send("erro!");
            return;
        }
    });
});

router.post('/excluirTarefa', function(req,res){
    console.log("testeExclusao");
    console.log(req.body.id);
    let id = req.body.id;
    var db = req.db;
    var logTarefas = db.get('tarefasLog');
    logTarefas.remove({_id: id}, function(err , r){
        if(!err){
            res.send("Deu certo!");
        }
        else{
            res.send("Erro!");
        }
    });
});
router.post('/fazerTarefa', function(req,res){
    console.log("testeStatus");

    let id = req.body.id;
    var db = req.db;
    console.log(id);
    var logTarefas = db.get('tarefasLog');
    logTarefas.find({_id: id}, {sort: {id:-1}}, function(err, tarefas){
        console.log("entrou");
        console.log(err);
        if(!err){
            if(tarefas[0]._status<1){
                let tarefaCorrente = {
                    "_nomeUsuario" : tarefas[0]._nomeUsuario,
                    "_forno" : tarefas[0]._forno,
                    "_titulo" : tarefas[0]._titulo,
                    "_descricao" : tarefas[0]._descricao,
                    "_data" : tarefas[0]._data,
                    "_status" : "1"
                }
                logTarefas.update({_id: id},tarefaCorrente, function(){
                    res.send("Deu certo!");
                });
            }
            else{
                res.send("A tarefa já está com esse status");
            }
        }
        else{
            res.send("erro");
        }
        
    });
});

router.post('/concluirTarefa', function(req,res){
    console.log("testeStatus");
    let id = req.body.id;
    var db = req.db;
    console.log(id);
    var logTarefas = db.get('tarefasLog');
    logTarefas.find({_id: id}, {sort: {id:-1}}, function(err, tarefas){
        console.log("entrou");
        console.log(err);
        if(!err){
            if(tarefas[0]._status<2){
                let tarefaCorrente = {
                    "_nomeUsuario" : tarefas[0]._nomeUsuario,
                    "_forno" : tarefas[0]._forno,
                    "_titulo" : tarefas[0]._titulo,
                    "_descricao" : tarefas[0]._descricao,
                    "_data" : tarefas[0]._data,
                    "_status" : "2"
                }
                logTarefas.update({_id: id},tarefaCorrente, function(){
                    res.send("Deu certo!");
                });
            }
            else{
                res.send("A tarefa já está com esse status");
            }
        }
        else{
            res.send("erro");
        }
        
    });
});

router.post('/obterDescricao', function(req,res){
    var db = req.db;
    let forno = parseInt(req.body.forno);
    console.log(forno);
    let descricaoSF = db.get('statusFornos');
    // console.log(descricaoSF);
    descricaoSF.find({_forno:forno}, function(err, descricaoF){
        if(!err){
            console.log(descricaoF);
            res.send({message:'no_msg', descricaoF:descricaoF});
        }
    });
});

router.post('/mudarDescricao', function(req,res){
    var db = req.db;
    let forno = parseInt(req.body.forno);
    let descricao = (req.body.descricao);
    let descricaoSF = db.get('statusFornos');
    let objetoAtualizado = 
    {
        "_forno":forno,
        "_status": descricao
    };
    descricaoSF.update({_forno: forno},objetoAtualizado, function(){
        res.send("atualizado");
    });
});

module.exports = router;