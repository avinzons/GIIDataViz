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
	//Color Scale
	var colorScaleGII = d3.scaleLinear()
	.domain([10, d3.max(innovation_data, function(d) { return d.GII; })])
	.range(["#A5ABAE", "#008AE5"]);

	//creating d3 axes

	var GII_axis = d3.axisLeft(GII_scale)
	.tickValues([0,20,40,60]);
	plot1.append("g")
	.attr("transform", "translate(300,0)")
	.call(GII_axis);

	var pr_axis = d3.axisBottom(pr_scale);
	plot1.append("g")
	.attr("transform", "translate(0,350)")
	.call(pr_axis);

	console.log(innovation_x_prscore)
			joininnov_x_pr();
			innovation_x_prscore.forEach(function (country) {
				plot1.append("circle")
				.attr("r", 8)
				.attr("cx", pr_scale(country["Score"]))
				.attr("cy", GII_scale(country["GII"]))
				.style("fill", colorScaleGII(country["GII"]))
				.style("opacity", .8)
				.on("mouseover", function () {
					plot1.select("#CountryName").text(country["Name"]);

				//temporary text labels
				// if(country["Name"] == "Singapore"){
				// 	plot1.append("text")
				// 	// .attr("class", "CountryName")
				// 	.text(country["Name"]);

				// 	plot1.append("line")
				// 	.attr("x1", pr_scale(country["Score"]))
				// 	.attr("x2", pr_scale(country["Score"]))
				// 	.attr("y1", GII_scale(country["GII"]))
				// 	.attr("y2", GII_scale(country["GII"]));
				// }
				});
			});
}

	d3.queue()
	.defer(d3.csv, "political-regime-updated2016.csv", formatYears)
	.defer(d3.csv, "Country-Data.csv", parseForm)
	.await(populate);
