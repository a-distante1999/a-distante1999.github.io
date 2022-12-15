$(document).ready(function () {

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(singleContainer).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Color scale used
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // Inizitialization array all data links and aux variables
    let carbon = new Array();
    let a = 0;
    let start = {};
    let end = {};
    let startPoint = 0;

    // Struttura base ausiliaria per disegnare i links
    let textCordinates = ["dy", "source", "sy", "target", "ty", "value"];
    let coordinates = ["dx", "dy", "x", "y"]
    for (var i = 0; i < 10; i++) {
        carbon[i] = {};
        carbon[i][textCordinates[0]] = 0;
        carbon[i][textCordinates[1]] = {};
        carbon[i][textCordinates[2]] = 0;
        carbon[i][textCordinates[3]] = {};
        carbon[i][textCordinates[4]] = 0;
        carbon[i][textCordinates[5]] = 2;

        for (var k = 0; k < 4; k++) {
            carbon[i][textCordinates[1]][coordinates[k]] = 0;
            carbon[i][textCordinates[3]][coordinates[k]] = 0;
        }
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
        /*
                // add in the links
                var link = svg.append("g")
                    .selectAll(".link")
                    .data(graph.links)
                    .enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("d", sankey.link())
                    .style("stroke-width", function (d) { return Math.max(1, d.dy); })
                    .sort(function (a, b) { return b.dy - a.dy; });
                    */

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
            .attr("height", function (d) {

                if (a != 0 && a != 11) {
                    // Riempio il source
                    // carbon[a - 1][textCordinates[1]][coordinates[0]] = start.dx;
                    // carbon[a - 1][textCordinates[1]][coordinates[1]] = start.dy / 100 * (graph.links[a - 1].value);
                    // carbon[a - 1][textCordinates[1]][coordinates[2]] = start.x;
                    carbon[a - 1].source.dx = start.dx;
                    carbon[a - 1].source.dy = start.dy / 100 * (graph.links[a - 1].value);
                    carbon[a - 1].source.x = start.x;
                    if (a == 1) {
                        carbon[a - 1][textCordinates[1]][coordinates[3]] = start.y;
                    } else {
                        carbon[a - 1][textCordinates[1]][coordinates[3]] = carbon[a - 2].source.y + carbon[a - 2].source.dy;
                    }
                    // Riempio il target
                    carbon[a - 1][textCordinates[3]][coordinates[0]] = d.dx;
                    carbon[a - 1][textCordinates[3]][coordinates[1]] = d.dy;
                    carbon[a - 1][textCordinates[3]][coordinates[2]] = d.x;
                    carbon[a - 1][textCordinates[3]][coordinates[3]] = d.y;
                } else if (a == 0) {
                    // start[coordinates[0]] = d.dx;
                    // start[coordinates[1]] = d.dy;
                    // start[coordinates[2]] = d.x;
                    // start[coordinates[3]] = d.y;
                    start[coordinates[0]] = 36;
                    start[coordinates[1]] = 890;
                    start[coordinates[2]] = 0;
                    start[coordinates[3]] = 0.3655079999999782;
                    startPoint = start[coordinates[3]];
                } else if (a == 11) {
                    end[coordinates[0]] = d.dx;
                    end[coordinates[1]] = d.dy;
                    end[coordinates[2]] = d.x;
                    end[coordinates[3]] = d.y;
                }
                a++;
                { return d.dy; }
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function (d) { return d3.rgb(d.color).darker(2); })
            // Add hover text
            .append("title")
            .text(function (d) {
                if (d.name == "Carbon storage") { return "Total carbon storage:  " + d.Abundance + " (kg/yr)"; }
                if (d.name == "Total annual benefits") { return "Total benefits: " + d.Abundance + " (eur/yr)"; }
                else { return d.name + "\n" + "Abundance: " + d.Abundance + " unit" }
            });

        //console.log(start)
        // console.log(carbon)
        // console.log(graph.links[0].value)
        // console.log(graph.nodes[0].name)
        // console.log("___________________________")
        // for (let i = 0; i < 10; i++) {
        //     console.log(carbon[i].source.y);
        // }
        // console.log("___________________________")

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

        // the function for moving the nodes]]
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

        //array of d3 sankey nodes
        var data = [
            {
                dy: 0,
                source: { dx: 36, dy: 24.92, x: 0, y: 0, }, sy: 0,
                target: { dx: 36, dy: 176.5, x: 472, y: -2.2737367544323206e-13 }, ty: 0, value: 2
            },
            {
                dy: 0,
                source: { dx: 36, dy: 155.75, x: 0, y: 24.92, }, sy: 0,
                target: { dx: 36, dy: 100.5, x: 472, y: 185 }, ty: 0, value: 2
            },
            {
                dy: 0,
                source: { dx: 36, dy: 91.67, x: 0, y: 155.75, }, sy: 0,
                target: { dx: 36, dy: 92.5, x: 472, y: 294.5 }, ty: 0, value: 2
            },
        ]

        console.log(data)
        console.log(carbon)
        svg.selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .style("stroke-width", "black")
            .attr("d", function (d) { return link(d) });

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
    });
})




