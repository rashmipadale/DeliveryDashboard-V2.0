/**
Author: Rashmi Padale
**/

var gap = 2;
var spentLabel = "";
var estimLabel = "";

var colors = ["#00AAED", "#65C32F"];

var width = 400,
		height = 400,
		τ = 2 * Math.PI;

//Create Chart
//build(effortsData);	


//Plotting chart
function build(data, elem){

	var arc = d3.svg.arc()
			.startAngle(0)
			.endAngle(function (d) {
				return d.percentage / 100 * τ;
			})
			.innerRadius(function (d) {
				return 100 - d.index * (40 + gap)
			})
			.outerRadius(function (d) {
				return 140 - d.index * (40 + gap)
			})
			.cornerRadius(20);//modified d3 api only

	var background = d3.svg.arc()
			.startAngle(0)
			.endAngle(τ)
			.innerRadius(function (d, i) {
				return 100 - d.index * (40 + gap)
			})
			.outerRadius(function (d, i) {
				return 140 - d.index * (40 + gap)
			});

	var svg = d3.select(elem).append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("style","margin-left:33%")
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


	var gradient = svg.append("svg:defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "0%")
			.attr("y1", "100%")
			.attr("x2", "50%")
			.attr("y2", "0%")
			.attr("spreadMethod", "pad");

	gradient.append("svg:stop")
			.attr("offset", "0%")
			.attr("stop-color", "#00AAED")
			.attr("stop-opacity", 1);

	gradient.append("svg:stop")
			.attr("offset", "100%")
			.attr("stop-color", "#00AAED")
			.attr("stop-opacity", 1); 


	//add some shadows
	var defs = svg.append("defs");

	var filter = defs.append("filter")
			.attr("id", "dropshadow")

	filter.append("feGaussianBlur")
			.attr("in", "SourceAlpha")
			.attr("stdDeviation", 4)
			.attr("result", "blur");
	filter.append("feOffset")
			.attr("in", "blur")
			.attr("dx", 1)
			.attr("dy", 1)
			.attr("result", "offsetBlur");

	var feMerge = filter.append("feMerge");

	feMerge.append("feMergeNode")
			.attr("in", "offsetBlur");
	feMerge.append("feMergeNode")
			.attr("in", "SourceGraphic");

	var field = svg.selectAll("g")
			.data(data)
			.enter().append("g");

	field.append("path").attr("class", "progress").attr("filter", "url(#dropshadow)");

	field.append("path").attr("class", "bg")
			.style("fill", function (d) {
				return colors[d.index];
			}).style("opacity", 0.2).attr("d", background);

	field.append("text").attr('class','icon');
	field.append("text").attr('class','spent').text(spentLabel).attr("transform","translate(0, 0)");
	field.append("text").attr('class','estimate').text(estimLabel).attr("transform","translate(0,-160)");

	d3.transition().duration(7750).each(update);

	function update() {
		field = field
				.each(function (d) {
					this._value = d.percentage;
				})
				.data(data)
				.each(function (d) {
					d.previousValue = this._value;
				});

		field.select("path.progress").transition().duration(4750).delay(function (d, i) {
			return i * 200
		})
		.ease("elastic")
		.attrTween("d", arcTween)
		.style("fill", function (d) {
			if(d.index===0){
				return "url(#gradient)"
			}
			return colors[d.index];
		});
		field.select("text.icon").text(function (d) {
			return d.icon;
		}).attr("transform", function (d) {
			return "translate(10," + -(110 - d.index * (40 + gap)) + ")";
		});
		field.select("text.completed").text(function (d) {
			return Math.round(d.percentage /100 * 600);
		});
	}

	function arcTween(d) {
		var i = d3.interpolateNumber(d.previousValue, d.newPercentage);
		return function (t) {
			d.percentage = i(t);
			return arc(d);
		};
	}
}
	

