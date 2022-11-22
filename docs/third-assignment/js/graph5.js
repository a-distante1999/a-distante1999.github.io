$(document).ready(function () {
    // The svg
    const svg = d3.select(singleContainer)
        .append("svg")
        .attr("width", 1000)
        .attr("height", 800);

    let width = +svg.attr("width");
    let height = +svg.attr("height");

    //Definisco gli array di ogni singolo albero
    let pointsCeltis = [];
    let pointsAesculus = [];
    let pointsCarpinus = [];
    let pointsCordata = [];
    let pointsPlatanus = [];
    let pointsEuropaea = [];
    let pointsAcer = [];
    let pointsCupressus = [];
    let pointsJaponica = [];
    let pointsPrunus = [];
    let pointsOther = [];


    //Definisco variabili ausiliarie
    let a = b = c = d = e = f = g = h = k = j = p = 0;


    d3.json("../geo_data_trees.geojson").then(function (rawData) {

        console.log(rawData.features[0].properties.Name)

        for (let i = 0; i < 12512; i++) {
            if (rawData.features[i].properties.Name == "Celtis australis") {
                pointsCeltis[a] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                a = a + 1;
            }
            else if (rawData.features[i].properties.Name == "Aesculus hippocastanum") {
                pointsAesculus[b] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                b = b + 1;
            }
            else if (rawData.features[i].properties.Name == "Carpinus betulus") {
                pointsCarpinus[c] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                c = c + 1;
            }

            else if (rawData.features[i].properties.Name == "Tilia cordata") {
                pointsCordata[d] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                d = d + 1;
            }
            else if (rawData.features[i].properties.Name == "Platanus x hispanica") {
                pointsPlatanus[e] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                e = e + 1;
            }
            else if (rawData.features[i].properties.Name == "Tilia x europaea") {
                pointsEuropaea[f] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                f = f + 1;
            }
            else if (rawData.features[i].properties.Name == "Acer campestre") {
                pointsAcer[g] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                g = g + 1;
            }
            else if (rawData.features[i].properties.Name == "Cupressus") {
                pointsCupressus[h] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                h = h + 1;
            }
            else if (rawData.features[i].properties.Name == "Sophora japonica") {
                pointsJaponica[k] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                k = k + 1;
            }
            else if (rawData.features[i].properties.Name == "Prunus cerasifera") {
                pointsPrunus[j] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                j = j + 1;
            }
            else {
                pointsOther[p] = { long: parseFloat(rawData.features[i].geometry.coordinates[0]), lat: parseFloat(rawData.features[i].geometry.coordinates[1]) }
                p = p + 1;
            }
        }

        console.log(pointsOther)

        d3.json("../circoscrizioni.json").then(function (data) {
            // Map and projection
            const projection = d3.geoIdentity()
                .fitSize([width, height], data);

            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(data.features)
                .join("path")
                .attr("fill", "#C1C1C1")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "#FFF")


            svg
                .selectAll("myCircles")
                .data(pointsCeltis)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#E20202")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsAesculus)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#E2D102")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsCarpinus)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#91E202")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsCordata)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#02E272")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsPlatanus)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#02CAE2")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsEuropaea)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#0249E2")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsAcer)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#DF02E2")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsCupressus)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#E2026B")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsJaponica)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#951897")
                .attr("fill-opacity", 1)
            svg
                .selectAll("myCircles")
                .data(pointsPrunus)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", 0.5)
                .style("fill", "#FFFFFF")
                .attr("fill-opacity", 1)
            /*//plotOthers
                 svg
                 .selectAll("myCircles")
                 .data(pointsOther)
                 .join("circle")
                 .attr("cx", d => projection([d.long, d.lat])[0])
                 .attr("cy", d => projection([d.long, d.lat])[1])
                 .attr("r", 0.5)
                 .style("fill", "#000000")
                 .attr("fill-opacity", 1)*/
        })
    })






    // Load external data and boot


    /*
    d3.json("../geo_data_trees.geojson").then(function (rawData) {
        for (var i = 0; i < 3; i++) {
            points[i] = [{ long: rawData.features[i].geometry.coordinates[0], 'lat': rawData.features[i].geometry.coordinates[1] }]
        }
    })*/






});
