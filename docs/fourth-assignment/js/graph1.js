$(document).ready(function () {

    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1400 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select(singleContainer)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Append legend
    const legend = d3.select(singleContainer)
        .append("svg")
        .attr("width", 1400)
        .attr("height", 150);


    // Read the data
    d3.csv("../prova.csv").then(function (data) {

        // Group the data: I want to draw one line per group
        const sumstat = d3.group(data, d => d.yr); // nest function allows to group the calculation per level of a factor
        console.log(sumstat)

        // Add X axis 
        const x = d3.scaleLinear()
            .domain([1, 12])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 40])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Color palette
        const color = d3.scaleOrdinal()
            .domain("2013", "2014", "2015")
            .range(['#F20808', '#08F24E', '#6D08F2'])

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(+d.max); })
                    //.y(function (d) { return y(+d.min); })
                    (d[1])
            })

        svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.month); })
                    .y(function (d) { return y(+d.min); })
                    //.y(function (d) { return y(+d.min); })
                    (d[1])
            })

        // Draw the dot
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("cx", function (d) { return x(d.month); })
            .attr("cy", function (d) { return y(d.avg); })
            .attr("r", 2)
            .style("fill", function (d) { return color(d.yr) })

        legend.append("text").attr("x", 700).attr("y", 10).text("Month").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.left - 120)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
            .text("Temperature [Celsius]");
    })
})




