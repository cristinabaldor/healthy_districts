
// var bubblectx = document.getElementById("MyBubble").getContext('2d');
// var myBubbleChart = new Chart(ctx, {
//     type: 'bubble',
//     data: data,
//     options: options
// });
totalpop_data = [];

function get_population_pairs() {
	dataset_global["state_district"].forEach(function (v, i) {
		var t_object_pop = { x: 0, y: 0 };
		t_object_pop['x'] = v;
        t_object_pop['y'] = dataset_global["totalpop"][i];
        t_object_pop['r'] = dataset_global["totalpop"][i];
		totalpop_data.push(t_object_pop);
	}
	)
}

function bubble_load() {
    get_population_pairs();
    var bubblectx = document.getElementById("MyBubble").getContext('2d');
    var myBubbleChart = new Chart(bubblectx, {
        // The type of chart we want to create
        type: 'bubble',
        data: totalpop_data,
    })
}

