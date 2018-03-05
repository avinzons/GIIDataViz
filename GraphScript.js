// <script id="data-building">
var pr_data = {};
var innovation_data = [];
var innovation_x_prscore = [];
var avgdata = {};


var parseForm = function(d) {
	var country = {};
	country["Name"] = d[""];
	country["GII"] = +d[" Global Innovation Index"];
	country["IER"] = +d[" Innovation Efficiency Ratio"];
	country["IIS"] = +d[" Innovation Input Sub-index"];
	country["IOS"] = +d[" Innovation Output Sub-index"];
	country["BS"] = +d["Business sophistication(ranking)"];
	country["BS_V"] = +d["Business sophistication(value)"];
	country["CO"] = +d["Creative outputs"];
	country["CO_V"] = +d["Creative outputs(value)"];
	country["HCR"] = +d["Human capital and research(ranking)"];
	country["HCR_V"] = +d["Human capital and research(value)"];
	country["Infrastructure"] = +d["Infrastructure(ranking)"];
	country["Infrastructure_V"] = +d["Infrastructure(value)"];
	country["Institutions"] = +d["Institutions(ranking)"];
	country["Institutions_V"] = +d["Institutions(value)"];
	country["KTO"] = +d["Knowledge and technology outputs(ranking)"];
	country["KTO_V"] = +d["Knowledge and technology outputs(value)"];
	country["MS"] = +d["Market sophistication(ranking)"];
	country["MS_V"] = +d["Market sophistication(value)"];
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
			value["GII"] = country["GII"]
			value["IER"] = country["IER"]
			value["IIS"] = country["IIS"]
			value["IOS"] = country["IOS"]
			value["BS"] = country["BS"]
			value["BS_V"] = country["BS_V"]
			value["CO"] = country["CO"]
			value["CO_V"] = country["CO_V"]
			value["HCR"] = country["HCR"]
			value["HCR_V"] = country["HCR_V"]
			value["Infrastructure"] = country["Infrastructure"]
			value["Infrastructure_V"] = country["Infrastructure_V"]
			value["Institutions"] = country["Institutions"]
			value["Institutions_V"] = country["Institutions_V"]
			value["KTO"] = country["KTO"]
			value["KTO_V"] = country["KTO_V"]
			value["MS"] = country["MS"]
			value["MS_V"] = country["MS_V"]
			innovation_x_prscore.push(value);
		}
	})
}

var avgPolarRegimes = function () {
	var pTypes = ["democracy", "autocracy", "neither"];
	pTypes.forEach(function (type) {
		avgdata[type] = {};
		avgdata[type]["GII"] = 0
		avgdata[type]["IER"] = 0
		avgdata[type]["IIS"] = 0
		avgdata[type]["IOS"] = 0
		avgdata[type]["BS"] = 0
		avgdata[type]["BS_V"] = 0
		avgdata[type]["CO"] = 0
		avgdata[type]["CO_V"] = 0
		avgdata[type]["HCR"] = 0
		avgdata[type]["HCR_V"] = 0
		avgdata[type]["Infrastructure"] = 0
		avgdata[type]["Infrastructure_V"] = 0
		avgdata[type]["Institutions"] = 0
		avgdata[type]["Institutions_V"] = 0
		avgdata[type]["KTO"] = 0
		avgdata[type]["KTO_V"] = 0
		avgdata[type]["MS"] = 0
		avgdata[type]["MS_V"] = 0
		avgdata[type]["count"] = 0
	});

	innovation_x_prscore.reduce(function (tot, country) {
		if(country["Score"] >= 6){
			avgdata["democracy"]["GII"] += country["GII"]
			avgdata["democracy"]["IER"] += country["IER"]
			avgdata["democracy"]["IIS"] += country["IIS"]
			avgdata["democracy"]["IOS"] += country["IOS"]
			avgdata["democracy"]["BS"] += country["BS"]
			avgdata["democracy"]["BS_V"] += country["BS_V"]
			avgdata["democracy"]["CO"] += country["CO"]
			avgdata["democracy"]["CO_V"] += country["CO_V"]
			avgdata["democracy"]["HCR"] += country["HCR"]
			avgdata["democracy"]["HCR_V"] += country["HCR_V"]
			avgdata["democracy"]["Infrastructure"] += country["Infrastructure"]
			avgdata["democracy"]["Infrastructure_V"] += country["Infrastructure_V"]
			avgdata["democracy"]["Institutions"] += country["Institutions"]
			avgdata["democracy"]["Institutions_V"] += country["Institutions_V"]
			avgdata["democracy"]["KTO"] += country["KTO"]
			avgdata["democracy"]["KTO_V"] += country["KTO_V"]
			avgdata["democracy"]["MS"] += country["MS"]
			avgdata["democracy"]["MS_V"] += country["MS_V"]
			avgdata["democracy"]["count"] += 1

		}
		else if(country["Score"] <= -6){
			avgdata["autocracy"]["GII"] += country["GII"]
			avgdata["autocracy"]["IER"] += country["IER"]
			avgdata["autocracy"]["IIS"] += country["IIS"]
			avgdata["autocracy"]["IOS"] += country["IOS"]
			avgdata["autocracy"]["BS"] += country["BS"]
			avgdata["autocracy"]["BS_V"] += country["BS_V"]
			avgdata["autocracy"]["CO"] += country["CO"]
			avgdata["autocracy"]["CO_V"] += country["CO_V"]
			avgdata["autocracy"]["HCR"] += country["HCR"]
			avgdata["autocracy"]["HCR_V"] += country["HCR_V"]
			avgdata["autocracy"]["Infrastructure"] += country["Infrastructure"]
			avgdata["autocracy"]["Infrastructure_V"] += country["Infrastructure_V"]
			avgdata["autocracy"]["Institutions"] += country["Institutions"]
			avgdata["autocracy"]["Institutions_V"] += country["Institutions_V"]
			avgdata["autocracy"]["KTO"] += country["KTO"]
			avgdata["autocracy"]["KTO_V"] += country["KTO_V"]
			avgdata["autocracy"]["MS"] += country["MS"]
			avgdata["autocracy"]["MS_V"] += country["MS_V"]
			avgdata["autocracy"]["count"] += 1

		}else{
			avgdata["neither"]["GII"] += country["GII"]
			avgdata["neither"]["IER"] += country["IER"]
			avgdata["neither"]["IIS"] += country["IIS"]
			avgdata["neither"]["IOS"] += country["IOS"]
			avgdata["neither"]["BS"] += country["BS"]
			avgdata["neither"]["BS_V"] += country["BS_V"]
			avgdata["neither"]["CO"] += country["CO"]
			avgdata["neither"]["CO_V"] += country["CO_V"]
			avgdata["neither"]["HCR"] += country["HCR"]
			avgdata["neither"]["HCR_V"] += country["HCR_V"]
			avgdata["neither"]["Infrastructure"] += country["Infrastructure"]
			avgdata["neither"]["Infrastructure_V"] += country["Infrastructure_V"]
			avgdata["neither"]["Institutions"] += country["Institutions"]
			avgdata["neither"]["Institutions_V"] += country["Institutions_V"]
			avgdata["neither"]["KTO"] += country["KTO"]
			avgdata["neither"]["KTO_V"] += country["KTO_V"]
			avgdata["neither"]["MS"] += country["MS"]
			avgdata["neither"]["MS_V"] += country["MS_V"]
			avgdata["neither"]["count"] += 1

		}
	})
	pTypes.forEach(function (type){
		avgdata[type]["GII"] /= avgdata[type]["count"]
		avgdata[type]["IER"] /= avgdata[type]["count"]
		avgdata[type]["IIS"] /= avgdata[type]["count"]
		avgdata[type]["IOS"] /= avgdata[type]["count"]
		avgdata[type]["BS"] /= avgdata[type]["count"]
		avgdata[type]["BS_V"] /= avgdata[type]["count"]
		avgdata[type]["CO"] /= avgdata[type]["count"]
		avgdata[type]["CO_V"] /= avgdata[type]["count"]
		avgdata[type]["HCR"] /= avgdata[type]["count"]
		avgdata[type]["HCR_V"] /= avgdata[type]["count"]
		avgdata[type]["Infrastructure"] /= avgdata[type]["count"]
		avgdata[type]["Infrastructure_V"] /= avgdata[type]["count"]
		avgdata[type]["Institutions"] /= avgdata[type]["count"]
		avgdata[type]["Institutions_V"] /= avgdata[type]["count"]
		avgdata[type]["KTO"] /= avgdata[type]["count"]
		avgdata[type]["KTO_V"] /= avgdata[type]["count"]
		avgdata[type]["MS"] /= avgdata[type]["count"]
		avgdata[type]["MS_V"] /= avgdata[type]["count"]
	})
}



// TODO: Make a global variable to track all graph elements (Hashmap? Array? TBD)
var barGraphGenerator = function (svgelement, rank_category, rank_value) {
	var plot = d3.select("#"+svgelement);
	var height = +plot.attr("height");
	var width = +plot.attr("width");
	var h_padding = height*.1;
	var w_padding = width*.1;

	var valuedomain = [-100, 100];

	var value_scale = d3.scaleLinear()
	.domain(valuedomain)
	.range([w_padding, (width-w_padding)])

	var rank_dom = ["BS_V", "CO_V", "HCR_V", "Infrastructure_V", "Institutions_V", "KTO_V", "MS_V"];
	var categories_scale = d3.scaleBand()
	.domain(rank_dom.map(function (d) { return d; }))
	.range([h_padding, height-h_padding])

	var valueAxis = d3.axisBottom(value_scale);
	plot.append("g")
	.attr("transform", "translate(0,"+(h_padding)+")")
	.call(valueAxis);

	var categoriesAxis = d3.axisLeft(categories_scale);
	plot.append("g")
	.attr("transform", "translate("+(width/2)+", 0)")
	.call(categoriesAxis);

	// Variable height of y-axis value 0 on graph
	// var zp = value_scale(0)

	//TODO
	var makeside = function (regime) {
		(rank_dom).forEach(function (value) {
			plot.append("rect")
			.attr("class", "bar")
			.attr("id", regime)
			.attr("id2", avgdata[regime][value])
			.attr("x", (regime == "autocracy") ? (value_scale(-(avgdata[regime][value]))) : (value_scale(0)))
			.attr("y", categories_scale(value))
			.attr("width", value_scale(avgdata[regime][value]))
			.attr("height", (((height-h_padding)/rank_dom.length)-(height-h_padding)*.05))
		})
	}
	makeside("autocracy");
	makeside("democracy");

// 	plot.selectAll(".bar")
// 	.data(rank_dom)
// 	.enter().append("rect")
// 		.attr("class", "bar")
// 		.attr("id", function(k) { return k[rank_category]})
// 		.attr("y", function (k) { 
// 			return ((k["Score"] > 0) ? (value_scale(k["Score"])) : (value_scale(0)) )})
// 		.attr("x", function (k) { return categories_scale(k[rank_category])})
// 		.attr("width", )
// 		// TODO, fix the heighthn parameter
// 		.attr("height", (((height-h_padding)/rank_dom.length)) )
}

var populate = function () 
{
	joininnov_x_pr();
	avgPolarRegimes();
	var ixpgraph = function (graphID, binary) {// this is the code for the first plot
		var plot1 = d3.select("#"+graphID);
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
	
		//creating the line
		function make_x_gridlines(){
			return d3.axisBottom(pr_scale)
				.ticks(1)
		}

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
	
		plot1.append("text")
		.attr("class", "graphLabels")
		.attr("x", 550)
		.attr("y", 385)
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.text("full democracy");
	
		plot1.append("text")
		.attr("class", "graphLabels")
		.attr("x", 50)
		.attr("y", 385)
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.text("full autocracy");
	
		plot1.append("text")
		.attr("class", "graphLabels")
		.attr("x", 310)
		.attr("y", 390)
		.style("text-anchor", "middle")
		.style("font-size", "20px")
		.text("Political Regime");
	
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
						.attr("z-index", 100);}
					
		if(binary)	
			{
				plot1.append("g")
				.attr("class", "grid")
				.attr("transform", "translate(0,"+ height/2 +")")
				.style("fill", "orange")
				.style("stroke-width", 2)
				.call(make_x_gridlines()
				.tickSize(0)
				.tickFormat(""))
			}				
			//countries that will be labeled
					
				})
			};
	ixpgraph("plot1", 0);
	ixpgraph("plot2", 1);
	barGraphGenerator("plot3", "", "")

}

	d3.queue()
	.defer(d3.csv, "political-regime-updated2016.csv", formatYears)
	.defer(d3.csv, "Country-Data2.csv", parseForm)
	.await(populate);
