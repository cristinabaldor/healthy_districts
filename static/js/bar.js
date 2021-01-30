var totalpop = dataset_global['totalpop']
// var totalpopdesc = []
// console.log(totalpop)

function bar_load() {
    var barctx = document.getElementById("MyBar").getContext('2d');
    var barchart = new Chart(barctx, {
        // The type of chart we want to create
        type: 'bar',
        data: {
            labels: dataset_global['state_district'],
            datasets: [{
                label: 'Total Population',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: totalpop,
            }]
        },

        // Configuration options go here
        options: {
            title: {
				display: true,
				text: "Total Population by Congressional District",
				fontsize: 14,
			},
            tooltips: {
				callbacks: {
				  label: function(tooltipItems, data) {
					return data.datasets[0].data[tooltipItems.index].toLocaleString();;
				  }
				}
			  },
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                position: 'right',
                display: true,
            },
            scales: {
                yAxes: [{
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value.toLocaleString();
                        }
                        // minBarThickness: 500,
                        // categoryPercentage:500,
                        // barPercentage:500,

                    }
                }]
            }
        }
    });
}
bar_load();

function bar_sort() {
    var totalpop = dataset_global['totalpop'].sort()
    var totalpopdesc = totalpop.reverse()
    bar_load();
}

