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
	.attr("class", "graphLabels")
	.attr("x", 50)
	.attr("y", 50)

	var height = +plot1.attr("height");
	var width = +plot1.attr("width");

	var pr_scale = d3.scaleLinear()
	.domain([-10,10])
	.range([50, width-50]);
	var GII_scale = d3.scaleLinear()
	.domain([10, d3.max(innovation_data, function(d) { return d.GII; })]) //We should change it to d3.max
	.range([height-50, 50]);
	//Color Scale
	var colorScalePR = d3.scaleLinear()
	.domain([-10,10])
	.range(["red", "#008AE5"]);

	//creating d3 axes

	var GII_axis = d3.axisLeft(GII_scale)
	.tickValues([20,40,60]);
	plot1.append("g")
	.attr("class", "plotAxis")
	.attr("transform", "translate(300,0)")
	.call(GII_axis);


	var pr_axis = d3.axisBottom(pr_scale);
	plot1.append("g")
	.attr("class", "plotAxis")
	.attr("transform", "translate(0,350)")
	.call(pr_axis);

	console.log(innovation_x_prscore)
			joininnov_x_pr();
			//countries that will be labeled
			var textLabels = ["Singapore", "Yemen", "United States", "Switzerland"];
			innovation_x_prscore.forEach(function (country) {
				plot1.append("circle")
				.attr("id", country["Name"])
				.attr("r", 8)
				.attr("cx", pr_scale(country["Score"]))
				.attr("cy", GII_scale(country["GII"]))
				.style("fill", colorScalePR(country["Score"]))
				.style("opacity", .8)
				.on("mouseover", function () {
					plot1.select("#CountryName").text(country["Name"]);
				})
				
				if(textLabels.includes(country["Name"])){
					//highlight country point
					plot1.select("#"+country["Name"])
					.attr("stroke", "#fff")
					.attr("stroke-width", 2);	

					if(country["Name"] == "Singapore"){
					var xBuffer = 13;
					}

					if(country["Name"] == "Yemen"){
					var xBuffer = 8;
					};

					if(country["Name"] == "Switzerland"){
					var xBuffer = 18;
					}

					if(country["Name"] == "United States"){	
					var xBuffer = 22;
					}
					plot1.append("text")
					.attr("class", "graphLabels")
					.text(country["Name"])
					.attr("x", pr_scale(country["Score"])-xBuffer*7)
					.attr("y", GII_scale(country["GII"])+4);

					plot1.append("line")
					.attr("x1", pr_scale(country["Score"])-8)
					.attr("x2", pr_scale(country["Score"])-xBuffer*2)
					.attr("y1", GII_scale(country["GII"]))
					.attr("y2", GII_scale(country["GII"]));		

					//Unied States plot is hidden
					plot1.select("#United States")
					.attr("z-index", 100);
					
					
				}
			});
			
}

	d3.queue()
	.defer(d3.csv, "political-regime-updated2016.csv", formatYears)
	.defer(d3.csv, "Country-Data.csv", parseForm)
	.await(populate);
