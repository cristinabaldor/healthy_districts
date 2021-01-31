
var district_json = "/json/"
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
        dataset_global['diabetes'].push(data["diabetes"])
        dataset_global['obesity'].push(data["obesity"])
        dataset_global['ghlth'].push(data["ghlth"])
    });


});

// var state_district = dataset_global['state_district'];

