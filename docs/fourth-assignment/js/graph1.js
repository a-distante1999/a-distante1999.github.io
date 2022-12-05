$(document).ready(function () {

    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1400 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append years legend
    const legendColor = d3.select(singleContainer)
        .append("svg")
        .attr("width", 1400)
        .attr("height", 150);

    // Append the svg object to the body of the page
    const svg = d3.select(singleContainer)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Append graph legend
    const legendChart = d3.select(singleContainer)
        .append("svg")
        .attr("width", 1400)
        .attr("height", 70);

    // Read the data
    d3.csv("../prova.csv").then(function (data) {

        // Group the data: I want to draw one line per group
        const sumstat = d3.group(data, d => d.yr); // nest function allows to group the calculation per level of a factor
        console.log(sumstat)

        // Years array
        let years = [];

        for (let i = 0; i < sumstat.size; i++) {
            years[i] = Array.from(sumstat)[i][0]
        }
        console.log(years)

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

        // Color MAX
        const colorMax = d3.scaleOrdinal()
            .domain(years)
            .range(['#CB4335', '#884EA0', '#2471A3'])

        // Color MIN
        const colorMin = d3.scaleOrdinal()
            .domain(years)
            .range(['#F1948A', '#BB8FCE', '#85C1E9'])

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return colorMax(d[0]) })
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
            .attr("stroke", function (d) { return colorMin(d[0]) })
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
            .attr("r", 5)
            .style("fill", function (d) { return colorMax(d.yr) })


        legendChart.append("text").attr("x", 700).attr("y", 10).text("Month").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("transform", "rotate(-90)").attr("y", margin.left - 120).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").style("font-size", "15px").attr("alignment-baseline", "middle").text("Temperature [Celsius]");

        //Bottom legend
        //1993
        legendColor.append("text").attr("x", 415).attr("y", 15).text("1993").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 380).attr('y', 12).attr('fill', '#CB4335').attr('width', 25).attr('height', 5)
        //1997
        legendColor.append("text").attr("x", 415).attr("y", 52).text("1997").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 380).attr('y', 47).attr('fill', '#884EA0').attr('width', 25).attr('height', 5)
        //2001
        legendColor.append("text").attr("x", 615).attr("y", 15).text("2001").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 580).attr('y', 12).attr('fill', '#2471A3').attr('width', 25).attr('height', 5)
        //2005
        legendColor.append("text").attr("x", 615).attr("y", 50).text("2005").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 580).attr('y', 47).attr('fill', '#85C1E9').attr('width', 25).attr('height', 5)
        //2009
        legendColor.append("text").attr("x", 815).attr("y", 15).text("2009").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 780).attr('y', 12).attr('fill', '#85C1E9').attr('width', 25).attr('height', 5)
        //2013
        legendColor.append("text").attr("x", 815).attr("y", 50).text("2013").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 780).attr('y', 47).attr('fill', '#85C1E9').attr('width', 25).attr('height', 5)
        //2017
        legendColor.append("text").attr("x", 1015).attr("y", 15).text("2017").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 980).attr('y', 12).attr('fill', '#85C1E9').attr('width', 25).attr('height', 5)
        //2021
        legendColor.append("text").attr("x", 1015).attr("y", 50).text("2021").style("font-size", "20px").attr("alignment-baseline", "middle")
        legendColor.append('rect').attr('x', 980).attr('y', 47).attr('fill', '#85C1E9').attr('width', 25).attr('height', 5)
    })
})




