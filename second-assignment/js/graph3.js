const margin = { top: 30, right: 30, bottom: 30, left: 60 };

const object = {
    rawData: [],
    drawChart: function (selector) {
        // Copio i dati
        let data = [];
        this.rawData.forEach((row, index) => {
            data[index] = { ...row };
        });

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 70, left: 80 },
            width = 1160 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;
        // append the svg object to the body of the page
        var svg = d3.select(selector)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 0])
            .range([0, width]);
        svg.append("g")
            .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .attr("opacity", "0");
        
            //add label
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2 + margin.left)
        .attr("y", height + margin.top + 50)
            .text("Tree Height (m)");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 8000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the text label for the Y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Carbon storage");
        
        const colors = colorInterp();
        function colorInterp(){
            let value = [];
            // 224 are the number of species, so each specie has his own color
            for (let i = 0; i <224; i++) {
                value[i]=d3.interpolateRainbow(i*1/224);
            }
            return value;
        }

        // Color scale: give me a specie name, I return a color
        const color = d3.scaleOrdinal()
                    .domain(data)
                    .range(colors);

        // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
        // Its opacity is set to 0: we don't see it by default.
        var tooltip = d3.select(selector)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");

        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        // Tooltip timeout
        let timeout = null;

        // Clear tooltip timeout
        const removeTimeout = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };

        const mouseover = (event, d) => {
            removeTimeout();
            tooltip
            tooltip.html(`Tree: ${d.Name}<br>Carbon storage (kg):  ${d.Carbon_storage_kg} m<sup>2</sup>`)
                .style('display', 'block')
        };

        const mousemove = (event, d) => {
            // Move tooltip near mouse pointer
            tooltip
                .style('left', `${event.x}px`)
                .style('top', `${event.y - (parseFloat(tooltip.style('height')) * 3 / 2)}px`);
        };

        const mouseleave = (event, d) => {
                tooltip.style('display', 'none');
        };
       
        // Highlight the specie that is hovered
        const highlight = function(event,d){

            selected_specie = d.Name

            d3.selectAll(".dot")
            .transition()
            .duration(200)
            .style("fill", "lightgrey")
            .attr("r", 3)

            d3.selectAll("." + selected_specie)
            .transition()
            .duration(10)
            .style("fill", color(selected_specie))
            .attr("r", 7)
        }

        // Highlight the specie that is hovered
        const doNotHighlight = function(event,d){
            d3.selectAll(".dot")
            .transition()
            .duration(10)
            .style("fill", function (d) { 
                return color(d.Name);})
            .attr("r", 3 )
        }

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) { return "dot " + d.Name } )
            .attr("cx", function (d) { return x(d.Height); })
            .attr("cy", function (d) { return y(d.Carbon_storage_kg); })
            .attr("r", 3)
            .style("fill", function (d) { 
                return color(d.Name);})
            .on("mouseenter", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight );

        // new X axis
        x.domain([0, 60]);
        svg.select(".myXaxis")
            .transition()
            .duration(50)
            .attr("opacity", "1")
            .call(d3.axisBottom(x));

        svg.selectAll("circle")
            .transition()
            .delay(function (d, i) { return (i * 0.1); })
            .duration(100)
            .attr("cx", function (d) { return x(d.Height); })
            .attr("cy", function (d) { return y(d.Carbon_storage_kg); });

    }
};

$(document).ready(async function () {
    object.rawData = await d3.csv('../csv/graph3.csv');

    $(window).resize(function () {
        if (currentWidth !== window.innerWidth) {
            currentWidth = window.innerWidth;
            $(singleContainer).html('');
            object.drawChart(singleContainer);
        }
    });

    $(window).resize();
});
