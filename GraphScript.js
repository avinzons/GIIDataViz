// <script id="data-building">
var pr_data = {};
var innovation_data = [];
var innovation_x_prscore = [];
var avgdata = {};
var percentdiff = [];

var parseInnov = function(d) {
	var country = {};
	country["Name"] = d[""];
	country["GII"] = +d[" Global Innovation Index"];
	// IER, IIS, IOS turned out to be dummy data that proved uninsightful in later inspections
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

// formatPR generates the pr_data hashmap, with variables we are interested in by specific years. 
var formatPR = function(pr){
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

var avgPolarRegimes = function (avgScore) {
	var prTypes = ["democracy", "autocracy", "neither"];
	prTypes.forEach(function (type) {
		avgdata[type] = {};
		avgdata[type]["BS_V"] = 0
		avgdata[type]["CO_V"] = 0
		avgdata[type]["HCR_V"] = 0
		avgdata[type]["Infrastructure_V"] = 0
		avgdata[type]["Institutions_V"] = 0
		avgdata[type]["KTO_V"] = 0
		avgdata[type]["MS_V"] = 0
		avgdata[type]["count"] = 0
	});

	innovation_x_prscore.reduce(function (tot, country) {
		if(country["Score"] >= 6 && country["GII"] >= avgScore){
			avgdata["democracy"]["BS_V"] += country["BS_V"]
			avgdata["democracy"]["CO_V"] += country["CO_V"]
			avgdata["democracy"]["HCR_V"] += country["HCR_V"]
			avgdata["democracy"]["Infrastructure_V"] += country["Infrastructure_V"]
			avgdata["democracy"]["Institutions_V"] += country["Institutions_V"]
			avgdata["democracy"]["KTO_V"] += country["KTO_V"]
			avgdata["democracy"]["MS_V"] += country["MS_V"]
			avgdata["democracy"]["count"] += 1
		}
		else if(country["Score"] <= -6 && country["GII"] >= avgScore){
			avgdata["autocracy"]["BS_V"] += country["BS_V"]
			avgdata["autocracy"]["CO_V"] += country["CO_V"]
			avgdata["autocracy"]["HCR_V"] += country["HCR_V"]
			avgdata["autocracy"]["Infrastructure_V"] += country["Infrastructure_V"]
			avgdata["autocracy"]["Institutions_V"] += country["Institutions_V"]
			avgdata["autocracy"]["KTO_V"] += country["KTO_V"]
			avgdata["autocracy"]["MS_V"] += country["MS_V"]
			avgdata["autocracy"]["count"] += 1
		}else{
			avgdata["neither"]["BS_V"] += country["BS_V"]
			avgdata["neither"]["CO_V"] += country["CO_V"]
			avgdata["neither"]["HCR_V"] += country["HCR_V"]
			avgdata["neither"]["Infrastructure_V"] += country["Infrastructure_V"]
			avgdata["neither"]["Institutions_V"] += country["Institutions_V"]
			avgdata["neither"]["KTO_V"] += country["KTO_V"]
			avgdata["neither"]["MS_V"] += country["MS_V"]
			avgdata["neither"]["count"] += 1

		}
	})
	prTypes.forEach(function (type){
		avgdata[type]["BS_V"] /= avgdata[type]["count"]
		avgdata[type]["CO_V"] /= avgdata[type]["count"]
		avgdata[type]["HCR_V"] /= avgdata[type]["count"]
		avgdata[type]["Infrastructure_V"] /= avgdata[type]["count"]
		avgdata[type]["Institutions_V"] /= avgdata[type]["count"]
		avgdata[type]["KTO_V"] /= avgdata[type]["count"]
		avgdata[type]["MS_V"] /= avgdata[type]["count"]
	})
}



// TODO: Make a global variable to track all graph elements (Hashmap? Array? TBD)
var barGraphGenerator = function (svgelement) {
	var plot = d3.select("#"+svgelement);
	var height = +plot.attr("height");
	var width = +plot.attr("width");
	var h_padding = height*.1;
	var w_padding = width*.1;

	plot.append("text")
	.attr("x", width-w_padding+5)
	.attr("y", h_padding-10)
	.style("font-size", 14)
	.style("text-anchor", "middle")
	.html("Percent")

	plot.append("text")
	.attr("x", width-w_padding+5)
	.attr("y", h_padding-10)
	.attr("dy", "1em")
	.style("font-size", 14)
	.style("text-anchor", "middle")
	.html("Difference")

	var valuedomain = [30, 80];

	var value_scale = d3.scaleLinear()
	.domain(valuedomain)
	.range([w_padding*2.6, (width-w_padding*2)])

	var categories = [];
	var pseudocategories = ["Creative Outputs", "Institutions", "Human Capital and Research", "Business Sophistication", "Market Sophistication", "Infrastructure", "Knowledge Technology Variable"]
	var singlecategories = ["CO_V", "Institutions_V", "HCR_V", "BS_V", "MS_V", "Infrastructure_V", "KTO_V"];
	singlecategories.forEach(function (d) {
		categories.push(d);
		categories.push(d+"_A")
	})

	var categories_pseudoscale = d3.scaleBand()
	.domain(pseudocategories.map(function (d) { return d; }))
	.range([h_padding, height-h_padding])
	.padding(.1)

	var categories_scale = d3.scaleBand()
	.domain(categories.map(function (d) { return d; }))
	.range([h_padding, height-h_padding])
	.padding(.1)


	//This code is responsible for creating the 3rd plot- using barGraphGenerator()
	var makeBars = function () {
		singlecategories.forEach(function (value, index) {
			{	
				var bargroup = plot.append("g").attr("class", "bargroup")
				var bar = bargroup.append("rect")
				.attr("class", "bar")
				.attr("class", "autocracy")
				.attr("x", value_scale(30))
				.attr("y", categories_scale(value+"_A")-0.2*categories_scale.bandwidth())
				.attr("width", value_scale(avgdata["autocracy"][value]) - value_scale(30))
				.attr("height", 0.9*categories_scale.bandwidth())

				var bar2 = bargroup.append('rect')
				.attr("class", "bar")
				.attr("class", "democracy")
				.attr("x", value_scale(30))
				.attr("y", categories_scale(value))
				.attr("width", value_scale(avgdata["democracy"][value]) - value_scale(30))
				.attr("height", 0.9*categories_scale.bandwidth())

				var democrats = avgdata["democracy"][value];
				var autocrats = avgdata["autocracy"][value];
				console.log()
				percentdiff.push(d3.format(".0%")(Math.round(((democrats/autocrats)*100)-100)/100))
			} 
		})
	}

	makeBars();
	
	var pdiffscale = d3.scaleBand()
	.domain(percentdiff.map(function (d) { return d; }))
	.range([h_padding, height-h_padding])
	.padding(.1)

	var pdiffAxis = d3.axisRight(pdiffscale).tickSize(0);
	plot.append("g")
	.attr("transform", "translate("+(width-w_padding)+",0)")
	.attr("stroke-width", 0)
	.style("text-anchor", "middle")
	.call(pdiffAxis)

	var valueAxis = d3.axisTop(value_scale).tickValues([30,40,50,60,70,80]).tickSize(2);
	plot.append("g")
	.attr("transform", "translate(0,"+(h_padding)+")")
	.call(valueAxis);

	var pseudoCatAxis = d3.axisLeft(categories_pseudoscale).tickValues(pseudocategories).tickSize(0);
	var categoriesAxis = d3.axisLeft(categories_scale).tickValues(singlecategories).tickSize(0);
	plot.append("g")
	.attr("transform", "translate("+(w_padding*2.6)+", 0)")
	.style("visibility", "hidden")
	.call(categoriesAxis);
	plot.append("g")
	.attr("class", "axisLabels")
	.attr("transform", "translate("+(w_padding*2.6)+", 0)")
	.call(pseudoCatAxis);
}

var populate = function () 
{
	joininnov_x_pr();
	var avgScore = 0
	innovation_x_prscore.reduce(function (total, num) { avgScore += num["GII"] });
	avgScore /= innovation_x_prscore.length;
	avgPolarRegimes(avgScore);
	var ixpgraph = function (graphID, binary) { // this is the code for the first plot
		var plot1 = d3.select("#"+graphID);
		plot1.append("text")
		.attr("id", "CountryName")
		.attr("x", 50)
		.attr("y", 50)
	
		var height = +plot1.attr("height");
		var width = +plot1.attr("width");
	
		var pr_scale = d3.scaleLinear()
		.domain([-10,10])
		.range([(1/12)*width, width-((1/12)*width)]);

		var mean_scale = d3.scaleLinear()
		.domain([-10,10])
		.range([pr_scale(-11), pr_scale(11)]);

		var GII_scale = d3.scaleLinear()
		.domain([10, d3.max(innovation_data, function(d) { return d.GII; })]) 
		.range([height-50, 50]);
		//Color Scale
		var colorScalePR = d3.scaleLinear()
		.domain([-10,10])
		.range(["#C42E23", "#008AE5"]);
	
		//creating the line
		function make_x_gridlines(){
			return d3.axisBottom(mean_scale)
				.ticks(1)
		}

		//creating d3 axes for the 1st plot
		var GII_axis = d3.axisLeft(GII_scale)
		.tickValues([20,40,60]).tickSize(0);
		plot1.append("g")
		.attr("class", "plotAxis")
		.attr("transform", "translate(300,0)")
		.call(GII_axis);
	
	
		var pr_axis = d3.axisBottom(pr_scale);
		plot1.append("g")
		.attr("class", "plotAxis")
		.attr("transform", "translate(0,350)")
		.call(pr_axis);
	
		//axes labels for the 1st graph
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

		//add rectangle elemnts to plot 2
		if(binary){
			//rectangle highlight on democracy side of plot
			plot1.append("rect")
			.attr("class", "aboveMean")
			.attr("x", pr_scale(6))
			.attr("y", GII_scale(70))
			.attr("width", pr_scale(11)-pr_scale(6))
			.attr("height", GII_scale(avgScore)-GII_scale(70));

			plot1.append("rect")
			.attr("class", "aboveMean")
			.attr("x", pr_scale(-11))
			.attr("y", GII_scale(70))
			.attr("width", pr_scale(11)-pr_scale(6))
			.attr("height", GII_scale(avgScore)-GII_scale(70));
		}
		
		//labels for highlighted countries
		var textLabels1 = ["Singapore", "Yemen", "United States", "Switzerland"];
		var textLabels2 = ["Switzerland", "United States", "China", "United Arab Emirates", "Vietnam", "Qatar"];
		innovation_x_prscore.forEach(function (country) {

					plot1.append("circle")
					.attr("id", country["Name"])
					.attr("r", 8)
					.attr("cx", (country["Score"] >= 6) ? (pr_scale(country["Score"]) + Math.random()*(width*.02)) : (pr_scale(country["Score"])))
					.attr("cy", GII_scale(country["GII"]))
					.style("fill", colorScalePR(country["Score"]))
					.style("opacity", (!binary ) ? (.8) : ( (Math.abs(country["Score"])<6 || country["GII"]<avgScore)?(0.2): (0.8) ))
					.attr("stroke", (binary && (textLabels2.includes(country["Name"])) || !binary && textLabels1.includes(country["Name"]))? ("#fff") : ("none"))
					.attr("stroke-width", (binary && (textLabels2.includes(country["Name"])) || !binary && textLabels1.includes(country["Name"]))? ("2") : ("0"));
					// .on("mouseover", function () {
					// 	plot1.select("#CountryName").text(country["Name"]);
					// })
					if(!binary){
						if(textLabels1.includes(country["Name"])){
							console.log("#"+country["Name"]);	
		
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
						}	
					}	
					else{
						if(textLabels2.includes(country["Name"])){
							//highlight country point
							plot1.select("#"+country["Name"])
							.attr("stroke", "#fff")
							.attr("stroke-width", 2);	
		
							if(country["Name"] == "China"){
							var xBuffer = -3;
							}
		
							if(country["Name"] == "Qatar"){
							var xBuffer = -3;
							};

							if(country["Name"] == "Vietnam"){
							var xBuffer = -3;
							};

							if(country["Name"] == "United Arab Emirates"){
							var xBuffer = -3;
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
							.attr("x1", (country["Score"]<0)?(pr_scale(country["Score"])-8) : (pr_scale(country["Score"])+8))
							.attr("x2", (country["Score"] > 0) ? (pr_scale(country["Score"])-xBuffer*2) : (pr_scale(country["Score"])+xBuffer*2))
							.attr("y1", GII_scale(country["GII"]))
							.attr("y2", GII_scale(country["GII"]));
						}

					}
		
					//This is used to differentiate plot1 from plot2 without having to repeat all the code	
					if(binary)	
						{
							plot1.append("g")
							.attr('id', 'meanLine')
							.attr("transform", "translate(0,"+ GII_scale(avgScore) +")")
							.call(make_x_gridlines()
							.tickSize(0)
							.tickFormat(""))
						}			
					
				})
			};
	ixpgraph("plot1", 0);
	ixpgraph("plot2", 1);
	barGraphGenerator("plot3")


}

d3.queue()
.defer(d3.csv, "political-regime-updated2016.csv", formatPR)
.defer(d3.csv, "Country-Data2.csv", parseInnov)
.await(populate);
