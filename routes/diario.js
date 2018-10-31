var express = require('express');
var router = express.Router();


router.post('/',function(req,res){
    console.log("cheguei aqui");
    res.render('diario', {message:'no_msg'});
});


module.exports = router;