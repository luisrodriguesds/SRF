var realTimeFun;
var showChart;

function init(document) {
	//console.log("LA VAMOS NOS");
	var samples = []; 
	//var sample_num = 0;

	var dynamic_interval = 3;
	var interval_treshold = 10;

	var updateInterval = 100;   //miliseconds

	var chart_config = {
			title :{
				text: "Tempo(s) x Temperatura(°C)"
			},
			animationEnabled: false,      
			axisX: {
				interval: dynamic_interval,
				//title: "Tempo s"
			},
			/*axisY: {
				title: "Temperatura ºC"
			},*/
			data: [{
				type: "line",
				dataPoints: samples 
			}]
		};

	var chart = new CanvasJS.Chart(document.getElementById("chartContainer1"), chart_config);
	
	var updateChart = function (json_dataset) {

		//var json_dataset = JSON.parse(dataset);


	    if(samples.length < json_dataset.length) {
	    	//console.log("Dataset Length: " + json_dataset.length);

	    	//console.log("X: " + json_dataset.x);
	    	//console.log("Y: " + json_dataset.y);

			samples.push({
				x: json_dataset.x[samples.length],
				y: json_dataset.y[samples.length]
			});

			console.log(samples.length);

		  	if(samples[samples.length - 1].x > dynamic_interval * interval_treshold) {
		    	dynamic_interval *= interval_treshold/2; 
		    	chart.options.axisX.interval = dynamic_interval;
		    }

		    //console.log("	Dataset in UpdateChart: " + json_dataset);

		    ShowChart();
	    }
	}

	var realTimeUpdate = function(dataset) {
		//console.log("	Dataset in RealTime: " + dataset);
		setInterval(function(){updateChart(dataset)}, updateInterval);
	}

	var ShowChart = function() {
		chart.render();
	}

	realTimeFun = realTimeUpdate;
	showChart = updateChart;
}

function update(dataset) {
	//console.log("actual dataset: " + JSON.stringify(dataset))
	realTimeFun(dataset);
}