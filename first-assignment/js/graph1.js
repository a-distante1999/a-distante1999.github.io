const margin = { top: 0, right: 0, bottom: 0, left: 0 };

const object = {
    rawData: [],
    drawChart: function (selector) {
        // Copio i dati e li correggo
        let data = []
        this.rawData.forEach((row, index) => {
            data[index] = { ...row };
            data[index].Abundance = parseInt(data[index].Abundance);
            data[index].Canopy = parseFloat(data[index].Canopy).toFixed(2);
        });

        // Sort data
        data.sort((a, b) => b.Abundance - a.Abundance);

        // Slice data
        data.length = 25

        // Set chart dimensions
        const height = getHeight(data);
        const width = getWidth(selector) - margin.left - margin.right;

        // Add tooltip
        const tooltip = d3.select(selector)
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        // Add the svg object
        const svg = d3.select(selector)
            .append("svg")
            .attr("class", "bar-chart");

        const chart = svg.append("g");

        // Add Y axis
        const y = d3.scaleBand()
            .domain(data.map(d => d.Name))
            .range([0, height])
            .padding([0.1]);

        const yAxis = chart.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickSizeOuter(0));

        // Y axis width
        const yWidth = yAxis.node().getBBox().width;

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Abundance)])
            .range([0, width - yWidth]);

        const xAxis = chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Color palette
        const color = d3.scaleSequential()
            .domain([0, 100])
            .interpolator(d3.interpolateRainbow);

        // Tooltip timeout
        let timeout = null;

        // Clear tooltip timeout
        const removeTimeout = () => {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
        }

        const mouseover = (event, d) => {
            removeTimeout();

            // Show tooltip
            tooltip.html('Abundance: ' + d.Abundance + '<br>' + 'Canopy (avg.): ' + d.Canopy + ' m<sup>2</sup>')
                .style("display", "block");
        }

        const mousemove = (event, d) => {
            // Move tooltip near mouse pointer
            tooltip.style("left", (event.x) + "px")
                .style("top", (event.y - (parseFloat(tooltip.style('height')) * 3 / 2)) + "px")
        }

        const mouseleave = (event, d) => {
            removeTimeout();

            // Add Tooltip timeout
            timeout = setTimeout(() => {
                tooltip.style("display", "none");
            }, 150);
        }

        // Show the bars
        chart.append("g")
            .selectAll("g")
            .data(data)
            .join("rect")
            .attr("fill", d => color(Math.floor(d.Abundance) / 2329 * 100))
            .attr("x", d => x(0))
            .attr("y", d => y(d.Name))
            .attr("height", d => y.bandwidth())
            .attr("stroke", "black")
            .attr("stroke-width", ".5")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        // Fix svg dimension
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", chart.node().getBBox().height + margin.top + margin.bottom);

        // Fix y-axis position
        chart.attr("transform", `translate(${yWidth + margin.left},${margin.top})`)

        // Animation
        chart.selectAll("rect")
            .transition()
            .duration(1000)
            .attr("width", d => x(d.Abundance))
            .delay(function (d, i) {
                return (i * 75)
            })
    }
};

$(document).ready(async function () {
    object.rawData = await d3.csv("/first-assignment/csv/geo_data_trees_categories.csv");

    $(window).resize(function () {
        if (currentWidth !== window.innerWidth) {
            currentWidth = window.innerWidth;
            $(singleContainer).html('');
            object.drawChart(singleContainer);
        }
    });

    $(window).resize();
});
