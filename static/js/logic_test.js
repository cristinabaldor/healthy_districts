
var district_json = "http://127.0.0.1:5000/json/"
// var district_json = "/json/"
var dataset_global = {
    GEOID: [],
    totalpop: [],
    lackinsurance: [],
    party: [],
    full_name: [],
    gini_index_of_income_inequality: [],
    median_household_income: [],
    white: [],
    black: [],
    amerindian_native: [],
    asian: [],
    hawaiian_pacific: [],
    other_race: [],
    two_more_races: [],
    hispanic_latino: [],
    citizen_voters: [],
    state_district: [],
    csmoking: [],
    diabetes: [],
    obesity: [],
    ghlth: [],
    mhlth: [],
    url: [],
    twitter: [],
};
d3.json(district_json).then(function (district_data) {
    console.log(district_json);
    district_data.forEach(function (data) {
        dataset_global['GEOID'].push(data["GEOID"])
        dataset_global['totalpop'].push(data["totalpop"])
        dataset_global['party'].push(data["party"])
        dataset_global['full_name'].push(data["full_name"])
        dataset_global['gini_index_of_income_inequality'].push(data["gini_index_of_income_inequality"])
        dataset_global['median_household_income'].push(data["median_household_income"])
        dataset_global['white'].push(data["white"])
        dataset_global['black'].push(data["black"])
        dataset_global['amerindian_native'].push(data["amerindian_native"])
        dataset_global['asian'].push(data["asian"])
        dataset_global['hawaiian_pacific'].push(data["hawaiian_pacific"])
        dataset_global['other_race'].push(data["other_race"])
        dataset_global['two_more_races'].push(data["two_more_races"])
        dataset_global['hispanic_latino'].push(data["hispanic_latino"])
        dataset_global['citizen_voters'].push(data["citizen_voters"])
        dataset_global['state_district'].push(data["state_district"])
        dataset_global['csmoking'].push(data["csmoking"])
        dataset_global['lackinsurance'].push(data["lackinsurance"])
    });

});


var scatter_data_insurance = [];
// dataset_global["csmoking"].forEach((v,i)=>scatter_data.push({x:v,y:dataset_global["lackinsurance"][i]}));

function get_insurance_pairs() {
    dataset_global["white"].forEach(function (v, i) {
        var t_object = { x: 0, y: 0 };
        t_object['x'] = v;
        t_object['y'] = dataset_global["median_household_income"][i];
        scatter_data_insurance.push(t_object);

    })
}

var scatter_data_income = [];
// dataset_global["csmoking"].forEach((v,i)=>scatter_data.push({x:v,y:dataset_global["lackinsurance"][i]}));

function get_income_pairs() {
    dataset_global["white"].forEach(function (v, i) {
        var t_object = { x: 0, y: 0 };
        t_object['x'] = v;
        t_object['y'] = dataset_global["lackinsurance"][i];
        scatter_data_income.push(t_object);

    }
    )

}

// var color = Chart.helpers.color;
var scatterChartData = {
    datasets: [{
        label: 'Race vs. Uninsured',
        xAxisID: 'White % Population',
        yAxisID: 'Uninsured % Population',
        // borderColor: window.chartColors.red,
        // backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
        data: scatter_data_insurance
    },
    {
        label: 'Race vs. Median Income',
        xAxisID: 'White % Population',
        yAxisID: 'Median Household Income',
        // borderColor: window.chartColors.red,
        // backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
        data: scatter_data_income
    }]
};


function scatter_load() {
    get_insurance_pairs();
    get_income_pairs();
    var scatterctx = document.getElementById("MyScatter").getContext('2d');
    var scatter = new Chart(scatterctx, {
        // The type of chart we want to create
        type: 'scatter',
        data: scatterChartData,
        options: {
            responsive: true,
            hoverMode: 'nearest',
            intersect: true,
            title: {
                display: true,
                text: 'Chart.js Scatter Chart - Multi Axis'
            },
        }
    })
};
scatter_load();

// var piectx = document.getElementById("MyPie").getContext('2d');

// var piedata = {
//     datasets: [{
//         data: 
// }],

//     // These labels appear in the legend and in the tooltips when hovering different arcs
//     labels: [
//         'Red',
//         'Yellow',
//         'Blue'
//     ]
// };

// var pie = new Chart(piectx, {
//     // The type of chart we want to create
//     type: 'pie',
//     data: piedata

// });

// var bubblectx = document.getElementById("MyBubble").getContext('2d');
// var bubble = new Chart(bubblectx, {
//     // The type of chart we want to create
//     type: 'line',
//     data: {
//         datasets: [{
//             label: dataset_global["state_district"],
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: dataset_global["totalpop"]
//         }]
//     },

//     // Configuration options go here
//     options: {}
// });

