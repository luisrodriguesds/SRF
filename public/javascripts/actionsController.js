exports.useAndFreeAction = function(collection, action, callback) {
    collection.findOne({type: "furnace_use", number: action.number}).then((data) => {
        if(data != undefined) {
            console.log("data defined");
            var _using = !data.using;
            var _name = _using ? action.user_name : false;
            var _user_is_wait = action.user_is_wait;

            collection.update( {type: "furnace_use", number: action.number}, 
            {
                $set: {
                using: _using,
                user_name: _name,
                user_is_wait: _user_is_wait
            }
            }, function(err, r) {
                callback(err, r);
            });
        } else {
            console.log("data undefined");
            collection.insert(action, function(err, r) {
                callback(err, r);
            });
        }
    });
}

exports.energyAndMotorAction = function(collection, action, callback) {
    collection.findOne({type: "furnace_energy_motor", number: action.number}).then((data) => {
        if(data != undefined) {
            var _energy = data.energy;
            var _motor = data.motor;

            if(action.energy != undefined) {
                _energy = action.energy;
            }

            if(action.motor != undefined) {
                _motor = action.motor;
            }

            collection.update( {type: "furnace_energy_motor", number: action.number}, 
            {
                $set: {
                energy: _energy,
                motor: _motor
            }
            }, function(err, r) {
                callback(err, r);
            });
        } else {
            collection.insert(action, function(err, r) {
                callback(err, r);
            });
        }
  });
}