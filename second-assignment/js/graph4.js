$(document).ready(function () {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    const svg = d3.select(".single-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    //Read the data
    d3.csv("https://raw.githubusercontent.com/a-distante1999/a-distante1999.github.io/main/second-assignment/csv/quarto_graph_prova.csv").then(function (data) {

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, 0])
            .range([0, width]);
        svg.append("g")
            .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .attr("opacity", "0")

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 500000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.Height); })
            .attr("cy", function (d) { return y(d.Carbon_storage_kg); })
            .attr("r", 1.5)
            .style("fill", "#69b3a2")

        // new X axis
        x.domain([0, 4000])
        svg.select(".myXaxis")
            .transition()
            .duration(2000)
            .attr("opacity", "1")
            .call(d3.axisBottom(x));

        svg.selectAll("circle")
            .transition()
            .delay(function (d, i) { return (i * 3) })
            .duration(2000)
            .attr("cx", function (d) { return x(d.Height); })
            .attr("cy", function (d) { return y(d.Carbon_storage_kg); })
    })
})