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
            .text("Tree Height");

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

        // Color scale: give me a specie name, I return a color
        const color = d3.scaleOrdinal().domain(data)
            .range(d3.schemeSet3);

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
        const mouseover = function (event, d) {
            tooltip
                .style("opacity", 1);
        };

        const mousemove = function (event, d) {
            tooltip
                .html("Tree: " + d.Name.replace(/_/g, ' ') + "<br> Carbon storage (kg): " + d.Carbon_storage_kg)
                .style("left", (event.x) / 2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y) / 2 + "px");
        };

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        const mouseleave = function (event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0);
        };

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.Height); })
            .attr("cy", function (d) { return y(d.Carbon_storage_kg); })
            .attr("r", 3)
            .style("fill", function (d) { return color(d.Name); })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

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
