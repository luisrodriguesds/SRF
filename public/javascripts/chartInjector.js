/*  Used to print real time charts in oven page
*/

//Use this method to load imediatly all the chart containers that you will use in a page

//POST function
exports.injectData = function(_actions, _log, data, callback) {
    _log.findOne({_id: data._id}).then((log) => {
      	if(log != undefined) {
			var _x = log.x.concat(data.x);
    		var _y = log.y.concat(data.y);

    	    _log.update( {_id: data._id}, 
          		{
            		$inc: {
              			length: data.amt
            		},

            		$set: {
              			x: _x,
              			y: _y
            	}
          	}, function(err, r) {
            	callback();

                if(data.author == "Forno Livre" || !data.author || data.author == ""){
                    if(log.length >= 9000){
                        _log.remove({_id: log._id}, function(err, obj){
                            if(err){
                                throw err;
                            }
                        });
                    }
                }
          	});
      	} else {
            _actions.findOne({type: "furnace_use", number: 1}).then((res) => {
                console.log("res: " + res.user_name);
            
                if(res.using){
                    data.author = res.user_name;
                } else {
                    data.author = "";
                }

                var date = new Date();
                var dateString = formatarData(date);

                data.length = 1;
                delete data.amt;

                data.begin_time = dateString;
        
                _log.insert(data, function(err, r) {
                    callback();
                });
            });
      	}
	});

	var date = new Date();
	var dateString = formatarData(date);
	_actions.update(
        {type:"furnace_use"},
  	    {$set:{
                last_data_time:dateString
            }
        },
      	function(err, r){
  	        if(err){
      		    throw err;
              	}
    	}
	);
}

function formatarData(data){
	return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear() + ' - ' + data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();
}