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
    d3.csv("../graph_1.csv").then(function (data) {

        // Group the data: I want to draw one line per group
        const sumstat = d3.group(data, d => d.yr); // nest function allows to group the calculation per level of a factor
        console.log(sumstat)

        // Years array
        let years = [];
        for (let i = 0; i < sumstat.size; i++) {
            years[i] = Array.from(sumstat)[i][0]
        }

        // Add X axis 
        const x = d3.scaleLinear()
            .domain([1, 12])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([-15, 40])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //arancione, rosso, giallo, fucsia ,verde,  viola, blu, azzurro
        // Color MAX
        let maxColors = ['#FF8000', '#CD0000', '#CDAD00', '#FF1493', '#228B22', '#9B30FF', '#00FFFF', '#0000FF'];
        const colorMax = d3.scaleOrdinal()
            .domain(years)
            .range(maxColors)


        // Color MIN
        let minColors = ['#FFDAB9', '#FF0000', '#FFD700', '#FF82AB', '#00CD00', '#AB82FF', '#BBFFFF', '#6495ED'];
        const colorMin = d3.scaleOrdinal()
            .domain(years)
            .range(minColors)

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return colorMax(d[0]) })
            .attr("stroke-width", 2.5)
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
            .attr("stroke-width", 2.5)
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

        // 1 rosso, 3 arancione, 5 verde, 7 azzurro
        // 2 giallo, 4 fucsia, 6 viola, 8 blu
        //   //Bottom years legend
        for (let i = 0; i < 8; i++) {   // 8 deve divenatre sumstat.size
            //Bottom legend
            if (i % 2 == 0) {
                legendColor.append("text").attr("x", 340 + i * 100).attr("y", 20).text("000" + i).style("font-size", "20px").attr("alignment-baseline", "middle")
                legendColor.append('rect').attr('x', 300 + i * 100).attr('y', 12).attr('fill', maxColors[i]).attr('width', 30).attr('height', 6)
                legendColor.append('rect').attr('x', 300 + i * 100).attr('y', 20).attr('fill', minColors[i]).attr('width', 30).attr('height', 6)
            }
            else {
                legendColor.append("text").attr("x", 340 + (i - 1) * 100).attr("y", 55).text("000" + i).style("font-size", "20px").attr("alignment-baseline", "middle")
                legendColor.append('rect').attr('x', 300 + (i - 1) * 100).attr('y', 47).attr('fill', maxColors[i]).attr('width', 30).attr('height', 6)
                legendColor.append('rect').attr('x', 300 + (i - 1) * 100).attr('y', 55).attr('fill', minColors[i]).attr('width', 30).attr('height', 6)
            }
            //text("000" + i) ==> text(years[i]) oppure text(Array.from(sumstat)[i][0])
        }
    })
})




