var insurance_dataw = [];
var income_dataw = [];
var obesity_dataw = [];
var citizen_voters_dataw = [];
var smoking_dataw = [];
// dataset_global["csmoking"].forEach((v,i)=>scatter_data.push({x:v,y:dataset_global["lackinsurance"][i]}));

function get_insurance_pairsw() {
	dataset_global["white"].forEach(function (v, i) {
		var t_objectw = { x: 0, y: 0 };
		t_objectw['x'] = v;
		t_objectw['y'] = dataset_global["lackinsurance"][i];
		insurance_dataw.push(t_objectw);
	}
	)
}

function get_smoking_pairsw() {
	dataset_global["white"].forEach(function (v, i) {
		var t_object_smow = { x: 0, y: 0 };
		t_object_smow['x'] = v;
		t_object_smow['y'] = dataset_global["csmoking"][i];
		smoking_dataw.push(t_object_smow);
	}
	)
}

function get_obesity_pairsw() {
	dataset_global["white"].forEach(function (v, i) {
		var t_object_obew = { x: 0, y: 0 };
		t_object_obew['x'] = v;
		t_object_obew['y'] = dataset_global["obesity"][i];
		obesity_dataw.push(t_object_obew);
	}
	)
}

function scatter_loadw() {
	get_insurance_pairsw();
	get_smoking_pairsw();
	get_obesity_pairsw();
	var scatterwctx = document.getElementById("MywScatter").getContext('2d');
	var scatterw = new Chart(scatterwctx, {
		// The type of chart we want to create
		type: 'scatter',
		data: {
			labels: dataset_global['state_district'],
			datasets: [{
				label: 'Obesity Rate',
				backgroundColor: 'slateblue',
				// borderColor: 'rgb(255, 99, 132)',
				data: obesity_dataw
			}, {
				label: 'Uninsured Rate',
				backgroundColor: 'lightseagreen',
				// borderColor: 'rgb(255, 99, 132)',
				data: insurance_dataw
			}, {
				label: 'Current Smokers',
				backgroundColor: 'lightcoral',
				// borderColor: null,
				data: smoking_dataw
			}]
		},

		// Configuration options go here
		options: {
			tooltips: {
				callbacks: {
				  label: function(tooltipItems, data) {
					return data.labels[tooltipItems.index];
				  }
				}
			  },
			parsing: false,
			
			// responsive: true,
			// hoverMode: 'nearest',
			// intersect: 'true',
			title: {
				display: true,
				text: "Race (White/Non-white) vs Health Outcomes",
				
			},
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom',
					ticks: {
						beginAtZero: true,
						callback: function (value) {
							return (value * 100).toFixed(0) + '%'; // convert it to percentage
						}
					}
				}],
				yAxes: [{
					type: 'linear',
					ticks: {
						// min: 0,
						// max: ,
						callback: function (value) {
							return (value * 100).toFixed(0) + '%'; // convert it to percentage
						},
					}

				}]

			},
			legend: {
				position: 'right'


			}
			// tooltips: {
			// 	callbacks: {
			// 	  title: (items, data) => data.datasets[items[0].datasetIndex].data[items[0].index].state_district,
			// 	  label: (item, data) => data.datasets[item.datasetIndex].data[item.index].state_district
			// 	}
			//   }
		}
	});
}

