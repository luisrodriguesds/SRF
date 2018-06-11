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
var chart = require('../public/javascripts/chartInjector.js');
var actions_controller = require('../public/javascripts/actionsController.js');
var fs = require("fs");

router.post('/realTime', function(req, res, next) {
	// checar se alguém está usando e gravar os dados de acordo

    console.log(req.body);
	
    try{
        var oven_content = JSON.parse(req.body);
        var db = req.db;
        var reading_log = db.get('reading_log');
        var actions = db.get("actions");

        chart.injectData(actions, reading_log, oven_content, function() {
            console.log('Injected');
            next();
        });
    } catch(err){
        console.log("Erro: " + err.message);
    }

}, function(req, res, next) {
    var db = req.db;
    var reading_log = db.get('reading_log');

    reading_log.find({}, {limit: 1, sort: {_id: -1}}, function(err, log) {
        if(log != undefined) {
            req.update_dataset = log[0];
        }
        next();
    });

}, function(req, res, next) {
    var actions = req.db.get("actions");
    actions.findOne({type: "furnace_use", number: 1}).then((data) => {
       req.app.io.emit('update_1', req.update_dataset);
       req.app.io.emit('update_last_data_1', data.last_data_time);
       res.status(200).send(""); 
    });
});

router.post('/action_use', function(req, res, next) {
    var action = req.body;
    var db = req.db;
    var actions = db.get('actions');

    action.number = parseInt(action.number);

    actions_controller.useAndFreeAction(actions, action, function(err, r) {
        console.log("Action Results: " + err + "   %j", r);
        res.end();
    });
});

router.post('/action_energy_motor', function(req, res, next) {
    var action = req.body;
    var db = req.db;
    var actions = db.get('actions');

    action.number = parseInt(action.number);

    actions_controller.energyAndMotorAction(actions, action, function(err, r) {
        res.end();
    });
});

//this route allways show the maxID experiment.
router.get('/', function(req, res, next) {
    req.session_controller.checkAuth(req, function(user) {
        if(!user) {
            res.redirect("/auth/login");
            res.end();
            return;
        }

        next();
    });

}, function(req, res, next) {
    var db = req.db;
    var reading_log = db.get('reading_log');

    var parameters = {};

    parameters.is_admin = req.session.profile_info.is_admin;
    parameters.is_wait = req.session.profile_info.is_wait;

    //order decrescent to get max id
    reading_log.find({}, {limit: 1, sort: {_id: -1}}, function(err, log) {
        console.log("searching dataset");

        if(log != undefined && log != null) {
            parameters.dataset = log[0];

            console.log("found dataset");
        }

        req.parameters = parameters;
        next();
    });
    
}, function(req, res, next) {
    var db = req.db;
    var actions = db.get('actions');

    var parameters = req.parameters;

    actions.findOne({type: "furnace_use", number: 1}).then((log) => {
        console.log("searching furnace use");

        if(log != undefined && log != null) {
            parameters.using = log.using;
            parameters.user_name = log.user_name;

            console.log("found furnace use");

            if(!parameters.using){
                parameters.dataset.begin_time = "Não há gravamento em andamento.";
            }
        }
        else {
            actions.insert({"type": "furnace_use",
                "number": 1,
                "using": false,
                "user_name": false});

            parameters.using = false;
            parameters.user_name = false;
        }

        parameters.session_user_name = req.session.profile_info.name;

        req.parameters = parameters;
        req.actions = actions;
        next();
    });

}, function(req, res, next) {
    var db = req.db;
    //var actions = db.get('actions');
    var actions = req.actions;

    var parameters = req.parameters;

    actions.findOne({type: "furnace_energy_motor", number: 1}).then((log) => {
        console.log("scearching furnace energy and motor");

        if(log != undefined && log != null) {
            parameters.energy = log.energy;
            parameters.motor = log.motor;
        }
        else {
            actions.insert({"type": "furnace_energy_motor",
                "number": 1,
                "energy": "off",
                "motor": "off"});
            
            parameters.energy = "off";
            parameters.motor = "off";
        }

        req.parameters = parameters;
        next();
    });

}, function(req, res, next) {
    var actions = req.actions;
    actions.findOne({type: "furnace_use", number: 1}).then((data) => {
        req.parameters.last_data_time = data.last_data_time;
    
        console.log("is_admin: " + req.parameters.is_admin + " " + req.parameters.session_user_name);

        res.render('oven', req.parameters);
        res.end();
    });
});

router.post("/ip", function(req, res){
	console.log("IP do esp: " + req.body);

	req.db.get("reading_log").find({}, {limit: 1, sort: {_id: -1}}, function(err, log) {
		if(err){
			throw err;
		}

        res.send((log[0]._id+1).toString());
    });
});

router.post("/log", function(req, res){
    var db = req.db;
    var reading_log = db.get('reading_log');

    reading_log.find({}, {sort: {_id: -1}}, function(err, log) {
        if(err)
            throw err;

        if(log != undefined && log != null) {
            res.render("log", {log: log});
        }
    });
});

router.post("/download", function(req, res){
    var reading_log = req.db.get("reading_log");

    reading_log.find({}, {sort: {_id: -1}}, function(err, log){
        fs.writeFile("./arquivo/analise.json", JSON.stringify(log[req.body.analise]), function(err){
            if(err){
                throw err;
            }

            res.download("./arquivo/analise.json", function(err){
                if(err){
                    throw err;
                }
            });
        });
    });
});

router.post("/getLastId", function(req, res){
	var db = req.db;
    var reading_log = db.get('reading_log');

    //order decrescent to get max id
    reading_log.find({}, {limit: 1, sort: {_id: -1}}, function(err, log) {
        if(log != undefined && log != null) {
            res.json(log[0]._id);
        }
    });
});

module.exports = router;