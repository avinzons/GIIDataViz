// <script id="data-building">
var pr_data = {};
var innovation_data = [];
var innovation_x_prscore = [];

var parseForm = function(d) {
	var country = {};
	country["Name"] = d[""];
	country["GII"] = +d[" Global Innovation Index"];
	country["BS"] = +d["Business sophistication"];
	country["CO"] = +d["Creative ouputs"];
	country["HCR"] = +d["Human captial and research"];
	country["Infrastructure"] = +d["Infrastructure"];
	country["Institutions"] = +d["Institutions"];
	country["KTO"] = +d["Knowledge and technology outputs"];
	country["MS"] = +d["Market sophistication"];
	innovation_data.push(country);
}

// formatYears generates the pr_data hashmap, with variables we are interested in by specific years. 
var formatYears = function(pr){
	if(pr["Year"] == "2015"){
		var subcountry = {};
		subcountry["Code"] = pr["Code"];
		subcountry["Name"] = pr["Entity"];
		subcountry["Score"] = +pr["Political Regime (OWID based on Polity IV and Wimmer & Min) (Score)"];
		pr_data[subcountry["Name"]] = subcountry
	}

}

// this code is responsible for doing a join on data from innovation_data and pr_data in O(innovatiation_data.length) time. For easy use in plotting. 
var joininnov_x_pr = function () {
	innovation_data.forEach(function (country) {
		if(pr_data[country["Name"]]) {
			value = {"Name" : country["Name"], "GII" : country["GII"], "Score" : pr_data[country["Name"]]["Score"]};
			innovation_x_prscore.push(value);
		}
	})
}

// TODO: Make a global variable to track all graph elements (Hashmap? Array? TBD)
var barGraphGenerator = function (svgelement, graphID, rank_category) {
	var plot = d3.select(svgelement);
	
	var height = +plot.attr("height");
	var width = +plot.attr("width");
	var h_padding = height*.1;
	var w_padding = width*.1;

	var maxpr = d3.max(innovation_x_prscore, function (d) { return d["Score"]});

	var pr_scale = d3.scaleLinear()
	.domain([-maxpr, maxpr])
	.range([h_padding, (height-h_padding)])

	var rank_scale = d3.scaleLinear()
	.domain([d3.extent(innovation_x_prscore, function(d) { return d[rank_category]})])
	.range([w_padding, width-w_padding]);

	var pr_axis = d3.axisLeft(pr_scale);
	plot.append("g")
	.attr("transform", "translate("+w_padding+",0)")
	.call(pr_axis);

	var rank_axis = d3.axisBottom(rank_scale);
	plot.append("g")
	.attr("transform", "translate(0, "+(height/2)+")")
	.call(rank_axis);

}

// <script id="chart-building">
var populate = function () 
{
	// this is the code for the first plot
	var plot1 = d3.select("#plot1");
	plot1.append("text")
	.attr("id", "CountryName")
	.attr("x", 50)
	.attr("y", 50)
	.style("font-size", "24pt");

	var height = +plot1.attr("height");
	var width = +plot1.attr("width");

	var pr_scale = d3.scaleLinear()
	.domain([-10,10])
	.range([50, width-50]);
	var GII_scale = d3.scaleLinear()
	.domain([10, d3.max(innovation_data, function(d) { return d.GII; })]) //We should change it to d3.max
	.range([height-50, 50]);

	//creating d3 axes

	var GII_axis = d3.axisLeft(GII_scale);
	plot1.append("g")
	.attr("transform", "translate(300,0)")
	.call(GII_axis);

	var pr_axis = d3.axisBottom(pr_scale);
	plot1.append("g")
	.attr("transform", "translate(0,350)")
	.call(pr_axis);

	
	joininnov_x_pr();
	innovation_x_prscore.forEach(function (country) {
		plot1.append("circle")
		.attr("r", 2)
		.attr("cx", pr_scale(country["Score"]))
		.attr("cy", GII_scale(country["GII"]))
		.style("fill", "black")
		.on("mouseover", function () {
			plot1.select("#CountryName").text(country["Name"]);
		});
	});
}

	d3.queue()
	.defer(d3.csv, "political-regime-updated2016.csv", formatYears)
	.defer(d3.csv, "Country-Data.csv", parseForm)
	.await(populate);
