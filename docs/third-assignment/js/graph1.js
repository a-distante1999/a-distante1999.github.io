$(document).ready(function () {
    // The svg
    const svg = d3.select(singleContainer)
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    let width = +svg.attr("width");
    let height = +svg.attr("height");

    // Map and projection
    const projection = d3.geoNaturalEarth1()
        .scale(100000)
        .center([11.15677965172273, 46.11660863851066])
        .translate([width / 2, height / 2]);


    /* .scale(width / 1.3 / Math.PI)
     .translate([width / 2, height / 2])*/

    // Load external data and boot
    d3.json("../circoscrizioni.json").then(function (data) {

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#000")
    })
});

//