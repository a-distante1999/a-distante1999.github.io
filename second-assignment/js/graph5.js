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
    d3.csv("/second-assignment/csv/geo_data_trees_full.csv").then(function (data) {
        const groups = data.map(d => (d["Name"]));
        const categories = groups.filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a > b)

        console.log(categories)

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d["Height (m)"])]) //SCALA ASSE X
            .range([0, width]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d["Carbon Storage (kg)"])]) //SCALA ASSE Y
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d["Canopy Cover (m2)"])])
            .range([4, 20]);

        // Add a scale for bubble color
        const myColor = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeSet2);

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
            tooltip
                .style("left", (event.x) + "px")
                .style("top", (event.y - (parseFloat(tooltip.style('height')) * 2)) + "px")
        }

        const hideTooltip = function (event, d) {
            tooltip
                .style("display", "none")
        }

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d["Height (m)"]))
            .attr("cy", d => y(d["Carbon Storage (kg)"]))
            .attr("r", d => z(d["Canopy Cover (m2)"]))
            .style("fill", d => myColor(d["Name"]))
            // -3- Trigger the functions
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)

    })
})
