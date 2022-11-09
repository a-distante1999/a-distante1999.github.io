$(document).ready(function () {
    // Set margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 60 };

    // Set chart dimensions
    const height = 600 - margin.top - margin.bottom;
    const width = 600 - margin.left - margin.right;

    // append the svg object to the body of the page
    const svg = d3.select(".single-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv("/second-assignment/csv/geo_data_trees_full.csv").then(function (rawData) {
        // Unisco i dati per specie di albero 
        let data = [];
        rawData.forEach(row => {
            // Struttura base
            obj = {
                "Name": row["Name"],
                "Abundance": 1,
                "Height": +row["Height (m)"],
                "Carbon": +row["Carbon Storage (kg)"],
                "Canopy": +row["Canopy Cover (m2)"]
            }

            // Cerco nei dati se esiste già quella specie di albero
            if (element = data.find(d => d["Name"] == obj["Name"])) {
                // Sommo i valori tra l'elemento già salvato e quello nuovo
                Object.keys(element).slice(1).forEach((key) => {
                    element[key] += +obj[key]
                });
            }
            else {
                // Aggiungo il nuovo elemento
                data.push(obj);
            }
        });

        // Eseguo la media dei valori
        data.forEach(row => {
            // Skippo le prime 2 chiavi che sono "Name" e "Abundance"
            Object.keys(row).slice(2).forEach((key) => {
                row[key] /= row["Abundance"]
            });
        })

        // Valore massimo scala delle X
        const xMax = d3.max(data, d => d["Height"]);
        // Valore massimo scala delle Y
        const yMax = d3.max(data, d => d["Carbon"]);
        // Valore massimo scala delle Z
        const zMax = d3.max(data, d => d["Canopy"]);

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0 - (xMax / 20), xMax + (xMax / 20)])
            .range([0, width]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0 - (yMax / 20), yMax + (yMax / 20)])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([0 - (zMax / 20), zMax + (zMax / 20)])
            .range([4, 20]);


        // Add a scale for bubble color
        const color = function (i) {
            return d3.interpolateWarm(i / data.length)
        };

        // -1- Create a tooltip div that is hidden by default:
        const tooltip = d3.select(".single-container")
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        const showTooltip = function (event, d) {
            tooltip
                .html(d["Name"])
                .style("display", "block")
        }

        const moveTooltip = function (event, d) {
            d3.select(event.target)
                .attr("stroke-width", "1");

            tooltip
                .style("left", (event.x) + "px")
                .style("top", (event.y - (parseFloat(tooltip.style('height')) * 2)) + "px")
        }

        const hideTooltip = function (event, d) {

            d3.select(event.target)
                .attr("stroke-width", "0");

            tooltip
                .style("display", "none")
        }

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("class", "bubbles")
            .attr("stroke", "black")
            .attr("stroke-width", "0")
            .attr("cx", d => x(d["Height"]))
            .attr("cy", d => y(d["Carbon"]))
            .attr("r", d => z(d["Canopy"]))
            .style("fill", (d, i) => color(i))
            // -3- Trigger the functions
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)

    })
})
