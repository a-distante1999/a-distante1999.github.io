$(document).ready(function () {

    let features = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic", "Jan"];
    features.reverse()

    // Inizializzo array con valori dei mesi
    let anno2013 = [];
    let anno2014 = [];
    let anno2015 = [];

    // Inizializzo variabili ausiliarie
    let a = 0;
    let b = 0;
    let c = 0;

    // Load data
    d3.csv("../prova.csv").then(function (data) {

        // i< numero mesi
        for (let i = 0; i < 36; i++) {
            if (data[i].yr == "2013") {
                anno2013[a] = data[i].avg
                a = a + 1;
            }
            if (data[i].yr == "2014") {
                anno2014[b] = data[i].avg
                b = b + 1;
            }
            if (data[i].yr == "2015") {
                anno2015[c] = data[i].avg
                c = c + 1;
            }
        }

        let points = [];
        points[0] = {
            Jan: anno2013[0], Feb: anno2013[1], Mar: anno2013[2],
            Apr: anno2013[3], May: anno2013[4], Jun: anno2013[5],
            Jul: anno2013[6], Aug: anno2013[7], Sep: anno2013[8],
            Oct: anno2013[9], Nov: anno2013[10], Dic: anno2013[11]
        }

        points[1] = {
            Jan: anno2014[0], Feb: anno2014[1], Mar: anno2014[2],
            Apr: anno2014[3], May: anno2014[4], Jun: anno2014[5],
            Jul: anno2014[6], Aug: anno2014[7], Sep: anno2014[8],
            Oct: anno2014[9], Nov: anno2014[10], Dic: anno2014[11]
        }

        points[2] = {
            Jan: anno2015[0], Feb: anno2015[1], Mar: anno2015[2],
            Apr: anno2015[3], May: anno2015[4], Jun: anno2015[5],
            Jul: anno2015[6], Aug: anno2015[7], Sep: anno2015[8],
            Oct: anno2015[9], Nov: anno2015[10], Dic: anno2015[11]
        }

        // SVG
        let svg = d3.select("body").append("svg")
            .attr("width", 650)
            .attr("height", 600);

        let radialScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0, 250]);

        let ticks = [5, 10, 15, 20, 25, 30];

        ticks.forEach(t =>
            svg.append("circle")
                .attr("cx", 300)
                .attr("cy", 300)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", radialScale(t))
        );

        ticks.forEach(t =>
            svg.append("text")
                .attr("x", 305)
                .attr("y", 300 - radialScale(t))
                .text(t.toString())
        );

        function angleToCoordinate(angle, value) {
            let x = Math.cos(angle) * radialScale(value);
            let y = Math.sin(angle) * radialScale(value);
            return { "x": 300 + x, "y": 300 - y };
        }

        for (var i = 0; i < features.length; i++) {
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let line_coordinate = angleToCoordinate(angle, 30);
            let label_coordinate = angleToCoordinate(angle, 32.5);

            // Draw axis line
            svg.append("line")
                .attr("x1", 300)
                .attr("y1", 300)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke", "black");

            // Draw axis label
            svg.append("text")
                .attr("x", label_coordinate.x - 10)
                .attr("y", label_coordinate.y)
                .text(ft_name);
        }
        let line = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        let colors = ["darkorange", "gray", "navy"];

        function getPathCoordinates(data_point) {
            let coordinates = [];
            for (var i = 0; i < features.length; i++) {
                let ft_name = features[i];
                let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
                coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
            }
            let angle = (Math.PI / 2) + (2 * Math.PI * 0 / features.length);
            coordinates.push(angleToCoordinate(angle, data_point["Jan"]));
            return coordinates;
        }

        //OCCHIO ALLA i (i = numero anni*12)
        for (var i = 0; i < 36; i++) {
            let d = points[i];
            let color = colors[i];
            let coordinates = getPathCoordinates(d);
            console.log(coordinates)

            // Draw the path element
            svg.append("path")
                .datum(coordinates)
                .attr("d", line)
                .attr("stroke-width", 2)
                .attr("stroke", color)
                .attr("fill", "none")
                .attr("opacity", 0.8);
        }
    })
})






