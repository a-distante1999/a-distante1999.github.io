$(document).ready(function () {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(".single-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/a-distante1999/a-distante1999.github.io/main/second-assignment/csv/quinto_graph_prova.csv").then(function (data) {

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, 20]) //SCALA ASSE X
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 25]) //SCALA ASSE Y
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([0, 10])
            .range([4, 40]);

        // Add a scale for bubble color
        const myColor = d3.scaleOrdinal()
            .domain(["Abete", "Pino", "Salice", "Betulla", "Ciliegio", "Pesca", "Quercia",])
            .range(d3.schemeSet2);

        // -1- Create a tooltip div that is hidden by default:
        const tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        const showTooltip = function (event, d) {
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html("Country: " + d.Name)
                .style("left", (event.x) / 2 + "px")
                .style("top", (event.y) / 2 + 30 + "px")
        }
        const moveTooltip = function (event, d) {
            tooltip
                .style("left", (event.x) / 2 + "px")
                .style("top", (event.y) / 2 + 30 + "px")
        }
        const hideTooltip = function (event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d.Height))
            .attr("cy", d => y(d.Carbon_storage_kg))
            .attr("r", d => z(d.canopy_size))
            .style("fill", d => myColor(d.Name))
            // -3- Trigger the functions
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)

    })
})
