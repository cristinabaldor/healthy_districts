var insurance_data = [];
var income_data = [];
var obesity_data = [];
var citizen_voters_data = [];
var smoking_data = [];
// dataset_global["csmoking"].forEach((v,i)=>scatter_data.push({x:v,y:dataset_global["lackinsurance"][i]}));

function get_insurance_pairs() {
	dataset_global["median_household_income"].forEach(function (v, i) {
		var t_object = { x: 0, y: 0 };
		t_object['x'] = v;
		t_object['y'] = dataset_global["lackinsurance"][i];
		insurance_data.push(t_object);
	}
	)
}

function get_smoking_pairs() {
	dataset_global["median_household_income"].forEach(function (v, i) {
		var t_object_smo = { x: 0, y: 0 };
		t_object_smo['x'] = v;
		t_object_smo['y'] = dataset_global["csmoking"][i];
		smoking_data.push(t_object_smo);
	}
	)
}

function get_obesity_pairs() {
	dataset_global["median_household_income"].forEach(function (v, i) {
		var t_object_obe = { x: 0, y: 0 };
		t_object_obe['x'] = v;
		t_object_obe['y'] = dataset_global["obesity"][i];
		obesity_data.push(t_object_obe);
	}
	)
}

function scatter_load() {
	get_insurance_pairs();
	get_smoking_pairs();
	get_obesity_pairs();
	var scatterctx = document.getElementById("MyScatter").getContext('2d');
	var scatter = new Chart(scatterctx, {
		// The type of chart we want to create
		type: 'scatter',
		data: {
			labels: dataset_global['state_district'],
			datasets: [{
				label: 'Obesity Rate',
				backgroundColor: 'slateblue',
				// borderColor: 'rgb(255, 99, 132)',
				data: obesity_data
			}, {
				label: 'Uninsured Rate',
				backgroundColor: 'lightseagreen',
				// borderColor: 'rgb(255, 99, 132)',
				data: insurance_data
			}, {
				label: 'Current Smokers',
				backgroundColor: 'lightcoral',
				// borderColor: null,
				data: smoking_data
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
				text: "Median Household Income vs Health Outcomes",
				
			},
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom',
					ticks: {
						beginAtZero: true,
						callback: function (value, index, values) {
							if (parseInt(value) >= 1000) {
								return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
							} else {
								return '$' + value;
							}
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
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}



sleep(2000);
scatter_load();