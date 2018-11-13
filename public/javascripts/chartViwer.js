var realTimeFun;
var showChart;

function init(document) {
	var samples = []; 
	//var sample_num = 0;

	var dynamic_interval = 3;
	var interval_treshold = 10;

	var updateInterval = 100;   //miliseconds

	var chart_config = {
		title :{
			text: "Temperatura(°C) x Tempo(s)"
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
	var chart2 = new CanvasJS.Chart(document.getElementById("chartContainer1-2"),chart_config);

	var updateChart = function (json_dataset) {
	    if(samples.length < json_dataset.length) {
			samples.push({
				x: json_dataset.x[samples.length],
				y: json_dataset.y[samples.length]
			});

		  	if(samples[samples.length - 1].x > dynamic_interval * interval_treshold) {
		    	dynamic_interval *= interval_treshold/2; 
				chart.options.axisX.interval = dynamic_interval;
				chart2.options.axisX.interval = dynamic_interval;
		    }

		    ShowChart();
	    }
	}

	var realTimeUpdate = function(dataset) {
		setInterval(function(){
			updateChart(dataset)
		}, updateInterval);
	}

	var ShowChart = function() {
		chart.render();
		chart2.render();
	}

	realTimeFun = realTimeUpdate;
	showChart = updateChart;
}

function update(dataset) {
	realTimeFun(dataset);
}