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


module.exports = router;