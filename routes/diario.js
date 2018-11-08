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
    var tarefas = logTarefas.find();
    res.render('diario',{message:'no_msg', tarefas:tarefas});
    
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
        "_data" : data
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


module.exports = router;