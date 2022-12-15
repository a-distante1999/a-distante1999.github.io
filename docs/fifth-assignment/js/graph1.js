$(document).ready(function () {

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    var legend = d3.select(singleContainer)
        .append("svg")
        .attr("width", 1000)
        .attr("height", 80);

    // append the svg object to the body of the page
    var svg = d3.select(singleContainer).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Color scale used
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var data = [
        //CARBON STORAGE
        {
            dy: 0,
            source: { dx: 36, dy: 24.92, x: 0, y: 0.4, }, sy: 0,
            target: { dx: 36, dy: 175.3, x: 472, y: 0 }, ty: 0, value: 2,
            text: "Carbon storage: 70736 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 155.75, x: 0, y: 25.32, }, sy: 0,
            target: { dx: 36, dy: 99.67, x: 472, y: 185.32 }, ty: 0, value: 2,
            text: "Carbon storage: 438610 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 22.34, x: 0, y: 181.07, }, sy: 0,
            target: { dx: 36, dy: 91.7, x: 472, y: 295 }, ty: 0, value: 2,
            text: "Carbon storage: 62980 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 23.5, x: 0, y: 203.41, }, sy: 0,
            target: { dx: 36, dy: 87.22, x: 472, y: 396.68 }, ty: 0, value: 2,
            text: "Carbon storage: 65967 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 385.7, x: 0, y: 226.91, }, sy: 0,
            target: { dx: 36, dy: 85.44, x: 472, y: 493.89 }, ty: 0, value: 2,
            text: "Carbon storage: 1083313 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 144.6, x: 0, y: 612.61, }, sy: 0,
            target: { dx: 36, dy: 80.10, x: 472, y: 589.34 }, ty: 0, value: 2,
            text: "Carbon storage: 406394 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 13.08, x: 0, y: 757.21, }, sy: 0,
            target: { dx: 36, dy: 78.32, x: 472, y: 679.44 }, ty: 0, value: 2,
            text: "Carbon storage: 36849 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 71.2, x: 0, y: 770.29, }, sy: 0,
            target: { dx: 36, dy: 68.53, x: 472, y: 767.76 }, ty: 0, value: 2,
            text: "Carbon storage: 198211 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 28.6, x: 0, y: 841.49, }, sy: 0,
            target: { dx: 36, dy: 64.08, x: 472, y: 846.29 }, ty: 0, value: 2,
            text: "Carbon storage: 80562 [kg/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 20.4, x: 0, y: 870, }, sy: 0,
            target: { dx: 36, dy: 59.7, x: 472, y: 920.37 }, ty: 0, value: 2,
            text: "Carbon storage: 55874 [kg/yr]"
        },

        //EURO
        {
            dy: 0,
            source: { dx: 36, dy: 175.3, x: 472, y: 0 }, sy: 0,
            target: { dx: 36, dy: 132.6, x: 944, y: 0.4 }, ty: 0, value: 2,
            text: "Total annual benefit: 1706 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 99.67, x: 472, y: 185.32 }, sy: 0,
            target: { dx: 36, dy: 164.9, x: 944, y: 133 }, ty: 0, value: 2,
            text: "Total annual benefit: 2113 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 91.7, x: 472, y: 295 }, sy: 0,
            target: { dx: 36, dy: 39.9, x: 944, y: 297.9 }, ty: 0, value: 2,
            text: "Total annual benefit: 512 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 87.22, x: 472, y: 396.68 }, sy: 0,
            target: { dx: 36, dy: 46.9, x: 944, y: 337.8 }, ty: 0, value: 2,
            text: "Total annual benefit: 602 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 85.44, x: 472, y: 493.89 }, sy: 0,
            target: { dx: 36, dy: 221.6, x: 944, y: 384.7 }, ty: 0, value: 2,
            text: "Total annual benefit: 2845 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 80.10, x: 472, y: 589.34 }, sy: 0,
            target: { dx: 36, dy: 132.6, x: 944, y: 606.3 }, ty: 0, value: 2,
            text: "Total annual benefit: 1697 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 78.32, x: 472, y: 679.44 }, sy: 0,
            target: { dx: 36, dy: 19.7, x: 944, y: 738.9 }, ty: 0, value: 2,
            text: "Total annual benefit: 254 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 68.53, x: 472, y: 767.76 }, sy: 0,
            target: { dx: 36, dy: 62.3, x: 944, y: 758.6 }, ty: 0, value: 2,
            text: "Total annual benefit: 800 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 64.08, x: 472, y: 846.29 }, sy: 0,
            target: { dx: 36, dy: 44.5, x: 944, y: 820.9 }, ty: 0, value: 2,
            text: "Total annual benefit: 565 [eur/yr]"
        },
        {
            dy: 0,
            source: { dx: 36, dy: 59.63, x: 472, y: 920.37 }, sy: 0,
            target: { dx: 36, dy: 25.3, x: 944, y: 865.4 }, ty: 0, value: 2,
            text: "Total annual benefit: 314 [eur/yr]"
        },
    ]
    console.log(data)


    svg.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .style("stroke-width", "black")
        .attr("d", function (d) { return link(d) })
        .append("title")
        .text(function (d) {

            { return d.text }
        });

    //borrowed from sankey.js, draws one a line from top of source to top of target, top of target to bottom of target, bottom of target to bottom of source, bottom of source to top of source
    function link(d) {
        var curvature = .6;
        var x0 = d.source.x + d.source.dx,
            x1 = d.target.x,
            xi = d3.interpolateNumber(x0, x1),
            x2 = xi(curvature),
            x3 = xi(1 - curvature),
            y0 = d.source.y + d.sy + d.dy / 2,
            y1 = d.target.y + d.ty + d.dy / 2;
        return "M" + x0 + "," + y0
            + "C" + x2 + "," + y0
            + " " + x3 + "," + y1
            + " " + x1 + "," + y1
            + "L" + x1 + "," + (y1 + d.target.dy)
            + "C" + x3 + "," + (y1 + d.target.dy)
            + " " + x2 + "," + (y0 + d.source.dy)
            + " " + x0 + "," + (y0 + d.source.dy)
            + "L" + x0 + "," + y0;
    }

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(10)
        .size([width, height]);

    // load the data
    d3.json("../data_sankey_per.json", function (error, graph) {

        // Constructs a new Sankey generator with the default settings.
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(1);

        // add in the nodes
        var node = svg.append("g")
            .selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag()
                .subject(function (d) { return d; })
                .on("start", function () { this.parentNode.appendChild(this); })
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node
            .append("rect")
            .attr("height", function (d) { console.log(d); { return d.dy; } })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", "black")
            .style('stroke-opacity', '1')
            .style('stroke-width', '1')
            // Add hover text
            .append("title")
            .text(function (d) {
                if (d.name == "Carbon storage") { return "Total carbon storage:  " + d.Abundance + " (kg/yr)"; }
                if (d.name == "Total annual benefits") { return "Total benefits: " + d.Abundance + " (eur/yr)"; }
                else { return d.name + "\n" + "Abundance: " + d.Abundance + " unit" }
            });
        console.log(graph.nodes[0].name)

        // add in the title for the nodes
        node
            .append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return d.name; })
            .filter(function (d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + d.x + ","
                    + (d.y = Math.max(
                        0, Math.min(height - d.dy, d3.event.y))
                    ) + ")");

            sankey.relayout();
            link.attr("d", sankey.link());
        }

        legend.append("text").attr("x", 385).attr("y", 40).text("Use tooltip for more details!").style("font-size", "20px").attr("alignment-baseline", "middle")
    });
})




