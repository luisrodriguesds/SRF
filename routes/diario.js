var express = require('express');
var router = express.Router();


router.post('/',function(req,res){
    console.log("cheguei aqui");
    res.render('diario', {message:'no_msg'});
});

router.post('/novaTarefa',function(req,res){
    console.log("Teste para pegar os dados");
    console.log(req.body.nome);
    console.log(req.body.fornos);
    console.log(req.body.titulo);
    console.log(req.body.descricao);

    
});
module.exports = router;