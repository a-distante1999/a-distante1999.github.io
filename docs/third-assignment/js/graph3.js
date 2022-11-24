$(document).ready(function () {
    // The svg
    const svg = d3.select(singleContainer)
        .append("svg")
        .attr("width", 700)
        .attr("height", 500);

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

    let data = new Map()
    const colorScale = d3.scaleThreshold()
        .domain([200, 400, 600, 800, 1000, 1200, 1400, 1600])
        .range(d3.schemeBlues[9]);

    Promise.all([
        d3.json("../circoscrizioni.json"),
        d3.csv("../neighborhood.csv", function (d) {
            data.set(d.numero_cir, +d.oxygen)
        })
    ]).then(function (loadData) {

        let topo = loadData[0]

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
                .html(d.properties.nome + "<br>" + "Oxygen: " + d.total + "<br>" + "Abundance: " + d.properties.treeAbundance + "<br>" + "Area: " + d.properties.area + " m<sup>2</sup>" + "<br>")
                .style("left", (event.x) / 1.5 + "px")
                .style("top", (event.y) / 1.5 + "px")
        }

        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .duration(200)
            Tooltip.style('opacity', 0)
        }

        const projection = d3.geoIdentity().reflectY(true) 
            .fitSize([width, height], topo);

        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#000")

            .attr("fill", function (d, i) {
                d.total = data.get(d.properties.numero_cir) || 0;
                return colorScale(d.total);
            })
            .attr("class", function (d) { return "Country" })
            .style("opacity", 1)
            .on("mouseover", mouseOver)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseLeave)
    })
});