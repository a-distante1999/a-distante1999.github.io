$(document).ready(function () {

    let features = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic", "Jan"];
    let months = ["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic"];
    features.reverse()

    // Load data
    d3.csv("../prova.csv").then(function (data) {

        //Inizializzo array contente tutti i dati
        let anni = new Array();
        // Inizializzo variabili ausiliarie
        let k = 1;
        let a = 2013; // 1993; //anno di partenza

        for (var i = 0; i < 3; i++) { //3 deve divenatre 8 //Numero di anni ds considerare
            anni[i] = {};
            anni[i][months[0]] = a;
            a++; //a+4;
        }

        for (let i = 0; i < anni.length * 12; i++) {
            switch (data[i].yr) {
                case '2013':
                    anni[0][months[k]] = data[i].avg
                    k++;
                    break;
                case '2014':
                    anni[1][months[k]] = data[i].avg
                    k++;
                    break;
                case '2015':
                    anni[2][months[k]] = data[i].avg
                    k++;
                    break;
            }
            if (k == 13) k = 1;
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
        for (var i = 0; i < anni.length*12; i++) {
            let d = anni[i];
            let color = colors[i];
            let coordinates = getPathCoordinates(d);

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