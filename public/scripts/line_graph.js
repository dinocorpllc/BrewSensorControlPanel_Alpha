/**
 * Created by holland on 4/15/16.
 * modified from this example: http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
 */

function LineGraph(){
    var margin, width, height, numTicks,
        parseDate,
        x, y,
        xAxis, yAxis,
        valueLine,
        svg;

    this.initalize = function(){
        // Set the dimensions of the canvas / graph
        margin = {top: 30, right: 20, bottom: 30, left: 50};
        width = 600 - margin.left - margin.right;
        height = 270 - margin.top - margin.bottom;
        numTicks = 5;

        // Parse the date / time
        parseDate = d3.time.format("%d-%b-%y").parse;

        // Set the ranges
        x = d3.time.scale().range([0, width]);
        y = d3.scale.linear().range([height, 0]);

        // Define the axes
        xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);

        yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

        // var yAxisLines = d3.svg.line()
        //     .attr({
        //         x1 : 0,     y1 : function(d){return y(d.close);},
        //         x2 : width, y2 : function(d){return y(d.close);}
        //     });

        // Define the line
        valueline = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // Adds the svg canvas
        svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


    };

    this.repopulateGraph = function (){
        // Get the data
        d3.csv("data.csv", function(error, data) {
            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.close = +d.close;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.close; })]);

            // Add the valueline path.
            svg.append("path")
                .attr("class", "line")
                .attr("d", valueline(data));

            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.append("line")
                .attr("class", "y axis")
                .attr({
                    x1 : 0,     y1 : function(d){return y(d.close);},
                    x2 : width, y2 : function(d){return y(d.close);}
                });
        });
    };
}

