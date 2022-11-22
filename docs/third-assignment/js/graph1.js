$(document).ready(function () {
    // Create svg
    const svg = d3.select(singleContainer)
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);
    let width = +svg.attr("width");
    let height = +svg.attr("height");

    const Tooltip = d3.select(singleContainer)
        .append("div")
        .attr("class", "Tooltip")
        .attr('style', 'position: absolute; opacity: 0;')
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Create color palette
    let data = new Map()
    const colorScale = d3.scaleThreshold()
        .domain([200, 400, 600, 800, 1000, 1200, 1400, 1600])
        .range(d3.schemeGreens[9]);

    // Load external data and boot
    Promise.all([
        d3.json("../circoscrizioni.json"),
        d3.csv("../neighborhood.csv", function (d) {
            data.set(d.numero_cir, +d.tree)
        })
    ]).then(function (loadData) {

        // Load data for the map
        let topo = loadData[0]

        // Create tooltip

        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .1)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)

            Tooltip.style('opacity', 1)

        }

        var mousemove = function (event, d) {
            Tooltip
                .html(d.properties.nome + "<br>" + "number of trees: " + d.total + "<br>")
                .style("left", (event.x) / 2 + "px")
                .style("top", (event.y) / 2 - 30 + "px")
        }

        let mouseLeave = function (d) {

            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .duration(200)

            Tooltip.style("opacity", 0)

        }

        //Choose projection
        const projection = d3.geoIdentity()
            .fitSize([width, height], topo);

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#000000")

            // Set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.properties.numero_cir) || 0;
                return colorScale(d.total);
            })

            // Tooltip
            .attr("class", function (d) { return "Country" })
            .style("opacity", 1)
            .on("mouseover", mouseOver)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseLeave)
    })
});