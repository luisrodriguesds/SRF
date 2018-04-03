/*  Put license terms here

    This code was developed by Eduardo Melo de Carvalho Braga, for the
    physics laboratory LRX - Laboratório de Raios X da UFC.

    email: eduardom4020@gmail.com

    ##############################################################################
                                Revisions
    ##############################################################################
    
    -> 29/06/2017: Create basic documentation (oficial code creation date)                    
*/

var express = require('express');
var router = express.Router();
//var json = require('json-object').setup(global);

/*  1: The index is the main route for the Sistem. When user log with the DNS
    it will acess the route '/', and them the method GET redirect it to the
    '/main' route (wich is set in other file).
*/
router.get('/', function(req, res, next) {
    res.redirect('/auth');
});

/*router.post('/energyOn', function(req, res, next) {
    request.post(
        'http://192.168.1.3/energyOn',
        { payload: { energy: 'on' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("energyOn");
                console.log(body);
                req.send(body);
            }
        }
    );
});

router.post('/energyOff', function(req, res, next) {
    request.post(
        'http://192.168.1.3/energyOff',
        { payload: { energy: 'off' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("energyOff");
                console.log(body);
                req.send(body);
            }
        }
    );
});*/

module.exports = router;
