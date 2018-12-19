//var chart = require('./chartInjector.js');

exports.init = function(server, request, callback) {
	server.sockets.on('error', function (exception) {
	  	// handle or ignore error
	  	console.log("huhuhu");
	});

	server.sockets.on('connection', function(client) {
	
		client.emit('message', 'Sucefully connected!');

		client.on('join_room', function(payload) {
	        client.join(payload);
	        console.log("A client has joined the room");
	    });

	    client.on("disconnect", function(){
	    	console.log("The client has disconnected");
	    });

	    client.on("error", function(e){
	    	console.log("hihihi");
	    });

		client.on('using_furnace_1', function(payload) {
			// apenas colocar no banco de dados que alguém está gravando
			// e quem é essa pessoa

			console.log("using furnace 1");

			var data;

			if(payload == undefined) {
				data = {_id: -1, x: [], y: [], length: 0};
			}

			var id = payload._id + 1;
			data = {_id: id, x: [], y: [], length: 0};

			var user_name = payload.user_name;
			data.user_name = user_name;

			request.post({url:'http://0.0.0.0:3000/oven/getLastId', form:{}}, (err, res, body) => {
				request.post('http://10.2.192.100/changeId?_id=' + (parseInt(body)+1));
			
				server.sockets.in('general').emit('furnace_1_begin', data);

				request.post('http://0.0.0.0:3000/oven/action_use').form({
					"type": "furnace_use",
					"number": 1,
					"using": true,
					"user_name": data.user_name
				});
			});

			//request.post('http://10.2.192.110/useOn?_id=' + data._id + '&_user_name=' + data.user_name);

			// remover
			/*request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
				"type": "furnace_energy_motor",
				"number": 1,
				"energy": "on",
				"motor": "on"
			});*/
		});

		client.on('free_furnace_1', function(payload) {
			// apenas colocar no banco de dados que ninguém está gravando

			console.log("ending furnace 1");

			request.post({url:'http://0.0.0.0:3000/oven/getLastId', form:{}}, (err, res, body) => {
				server.sockets.in('general').emit('furnace_1_end', payload);
			
				request.post('http://10.2.192.100/changeId?_id=' + (parseInt(body)+1));

				request.post('http://0.0.0.0:3000/oven/action_use').form({
					"type": "furnace_use",
					"number": 1,
					"using": false
				});
			});

			// request.post('http://10.2.192.110/useOff');

			/*request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
				"type": "furnace_energy_motor",
				"number": 1,
				"energy": "off",
				"motor": "off"
			});*/
		});

		client.on('energy', function(payload) {
			if(payload == 'on') {
				request.post(
				    'http://10.2.192.100/energyOn',
				    { payload: { energy: 'on' } },
				    function (error, response, body) {
				        if (response.statusCode == 200 || response.statusCode == 302) {
				        	//para utilizar quando o esp estiver ligado
				            server.sockets.in('general').emit('energyChange', payload);

				            request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"energy": "on"
							});
				        }
				    }
				);

				//para fins de teste
				/*server.sockets.in('general').emit('energyChange', payload);

				request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"energy": "on"
							});*/
			}
			else if (payload == 'off') {
			  	request.post(
				    'http://10.2.192.100/energyOff',
				    { payload: { energy: 'off' } },
				    function (error, response, body) {
				        if (response.statusCode == 200 || response.statusCode == 302) {
				        	//para utilizar quando o esp estiver ligado
				            server.sockets.in('general').emit('energyChange', payload);

				            request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"energy": "off"
							});
				        }
				    }
				);

			  	/*server.sockets.in('general').emit('energyChange', payload);

			  	request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"energy": "off"
							});*/
			}
		});

		client.on('motor', function(payload) {
			if(payload == 'on') {
				request.post(
				    'http://10.2.192.100/motorOn',
				    { payload: { motor: 'on' } },
				    function (error, response, body) {
				    	if(error){
				    		console.log(error.message);
				    		throw error;
				    	}

				        if (response.statusCode == 200 || response.statusCode == 302) {
				            server.sockets.in('general').emit('motorChange', payload);

				            request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"motor": "on"
							});
				        }
				    }
				);

				/*server.sockets.in('general').emit('motorChange', payload);

				request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"motor": "on"
							});*/
			}
			else if (payload == 'off') {
			  	request.post(
				    'http://10.2.192.100/motorOff',
				    { payload: { motor: 'off' } },
				    function (error, response, body) {
				        if (response.statusCode == 200 || response.statusCode == 302) {
				            server.sockets.in('general').emit('motorChange', payload);

				            request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"motor": "off"
							});
				        }
				    }
				);

			  	/*server.sockets.in('general').emit('motorChange', payload);

			  	request.post('http://0.0.0.0:3000/oven/action_energy_motor').form({
								"type": "furnace_energy_motor",
								"number": 1,
								"motor": "off"
							});*/
			}
		});

		callback();
	});
}