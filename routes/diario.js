var express = require('express');
var router = express.Router();


router.post('/',function(req,res){
    console.log("cheguei aqui");
    res.render('diario', {message:'no_msg'});
});

router.get('/',function(req,res){
    console.log("postou");
    res.render('diario',{message:'no_msg'});
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