/* ---------------------------------------------- */
/*            CODE EXPLAINED TUTORIALS            */
/*         www.youtube.com/CodeExplained          */
/* ---------------------------------------------- */

// SELECT ALL ELEMENTS
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const ctx = document.getElementById("axes_line_chart").getContext("2d");

// APP VARIABLES
let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	deaths = [],
	formatedDates = [];

// GET USERS COUNTRY CODE
let country_code = geoplugin_countryCode();
let user_country;
console.log('Country Code is ',country_code);
country_list.forEach( country => {
	if( country.code == country_code ){
		user_country = country.Slug;
		
	}
});

/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */

// async function getCovidapi(country) {
// 	try {
// 		const result = await fetch(`https://api.covid19api.com/total/country/${country}`);
// 		const data = await result.json();
		
// 		console.log('Confirmed: ', data[data.length - 1].Confirmed);
// 		return data;
// 	} catch(error) {
// 		alert(error);
// 	}
// }
// getCovidapi('singapore');



function fetchData(user_country){
	country_name_element.innerHTML = "Loading...";

	cases_list = [], recovered_list =[], deaths_list = [], dates = [], formatedDates = [];
	
	fetch(`https://api.covid19api.com/total/country/${user_country}`, {
	//	"method": "GET"
		
	// fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${user_country}`, {
	// 	"method": "GET",
	// 	"headers": {
	// 		"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
	// 		"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
	// 	}
	})
	.then( response => {
		
		return response.json();

	})
	.then( data => {
        console.log('data is : ', data[data.length-1]);
		dates = Object.keys(data);
		
		
		dates.forEach( date => {
			let DATA = data[date];
			//console.log(DATA);
			formatedDates.push(formatDate(DATA.Date));
			app_data.push(DATA);
            cases_list.push(parseInt(DATA.Confirmed));
            //console.log(cases.list);
			//recovered_list.push(parseInt(DATA.Recovered.replace(/,/g, "")));
			recovered_list.push(parseInt(DATA.Recovered));
			//deaths_list.push(parseInt(DATA.Deaths.replace(/,/g, "")));
			deaths_list.push(parseInt(DATA.Deaths));
		})
	})
	.then( () => {
		updateUI();
	})
	.catch( error => {
		alert(error);
	})
}

fetchData(user_country);

// UPDATE UI FUNCTION
function updateUI(){
	updateStats();
	axesLinearChart();
}

function updateStats(){
	let last_entry = app_data[app_data.length - 1];
	let before_last_entry = app_data[app_data.length - 2];

	country_name_element.innerHTML = last_entry.Country;

	total_cases_element.innerHTML = numberWithCommas(last_entry.Confirmed || 0);
	new_cases_element.innerHTML = `+${numberWithCommas(parseInt(last_entry.Confirmed) - parseInt(before_last_entry.Confirmed) || 0) }`;

	recovered_element.innerHTML = numberWithCommas(last_entry.Recovered || 0);
	new_recovered_element.innerHTML = `+${numberWithCommas(parseInt(last_entry.Recovered) - parseInt(before_last_entry.Recovered) || 0)}`;
	
	deaths_element.innerHTML = numberWithCommas(last_entry.Deaths || 0);
	new_deaths_element.innerHTML = `+${numberWithCommas(parseInt(last_entry.Deaths) - parseInt(before_last_entry.Deaths) || 0)}`;
}

// UPDATE CHART
let my_chart;
function axesLinearChart(){

	if(my_chart){
		my_chart.destroy();
	}

	my_chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Cases 确诊',
				data: cases_list,
				fill : false,
				borderColor : '#FFF',
				backgroundColor: '#FFF',
				borderWidth : 1
			},{
				label: 'Recovered 痊愈',
				data: recovered_list,
				fill : false,
				borderColor : '#009688',
				backgroundColor: '#009688',
				borderWidth : 1
			},{
				label: 'Deaths 死亡',
				data: deaths_list,
				fill : false,
				borderColor : '#f44336',
				backgroundColor: '#f44336',
				borderWidth : 1
			}],
			labels: formatedDates
		},
		options: {
			responsive : true,
			maintainAspectRatio : false
		}
	});
}

// FORMAT DATES
const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(dateString){
	let date = new Date(dateString);

	return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}