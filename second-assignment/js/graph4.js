// TODO: fare un grafico per la top 6 di 'abundace'

$(document).ready(function () {
    // Set margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 60 };

    // Set chart dimensions
    const height = 600 - margin.top - margin.bottom;
    const width = 600 - margin.left - margin.right;

    // append the svg object to the body of the page
    const svg = d3.select('.single-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Read the data
    d3.csv('/second-assignment/csv/geo_data_trees_list.csv').then(function (data) {
        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.Height)])
            .range([0, width]);

        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.Carbon)])
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) { return x(d.Height); })
            .attr('cy', function (d) { return y(d.Carbon); })
            .attr('r', 1.5)
            .style('fill', '#69b3a2')
    })
})
