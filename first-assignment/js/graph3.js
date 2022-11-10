const minWidth = 200;

const margin = { top: 30, right: 15, bottom: 0, left: 15 };

const object = {
    rawData: [],
    getSubgroups: function () {
        return object.rawData.columns.slice(1);
    },
    drawChart: function (selector, category) {
        const subgroups = this.getSubgroups()

        let data = []
        this.rawData.forEach((row, index) => {
            data[index] = { 'Name': row.Neighborhood };
            Object.keys(row).forEach((d) => {
                if (d === category) {
                    data[index]['Abundance'] = +row[d];
                }
            });
        });

        // Set chart dimensions
        const height = getHorizontalChartHeight(data);
        let width = getElementWidth(selector) / (subgroups.length + 3) - margin.left - margin.right;

        if (width < minWidth) {
            width = minWidth - margin.left - margin.right;
        }

        // Incapsulo il selettore in un div
        selector = d3.select(selector)
            .append('div')
            .attr('class', 'container')
            .node();

        // Add tooltip
        const tooltip = d3.select(selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        // Append the svg object
        const svg = d3.select(selector)
            .append('svg')
            .attr('class', 'bar-chart');

        // Add title
        const title = svg.append('text')
            .attr('class', 'title')
            .attr('y', 10)
            .attr('x', '50%')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(category);

        const chart = svg.append('g');

        // Add Y axis
        const y = d3.scaleBand()
            .domain(data.map(d => d.Name))
            .range([0, height])
            .padding([0.1]);

        const yAxis = chart.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).tickSizeOuter(0))

        const yWidth = yAxis.node().getBBox().width;

        width = width + yWidth;

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Abundance)])
            .range([0, width - yWidth]);

        const xAxis = chart.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0).ticks(3));

        // Color palette
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#A63CB3', '#FD4B84', '#FA9832', '#31EE82', '#28A2DC', '#5366D7']);

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
            // Show tooltip
            tooltip.html(`Abundance: ${d.Abundance}`)
                .style('display', 'block');
        }

        const mousemove = (event, d) => {
            // Move tooltip near mouse pointer
            tooltip.style('left', `${event.x}px`)
                .style('top', `${event.y - (parseFloat(tooltip.style('height')) * 2)}px`)
        }

        const mouseleave = (event, d) => {
            removeTimeout();

            // Add Tooltip timeout
            timeout = setTimeout(() => {
                tooltip.style('display', 'none');
            }, 150);
        }

        // Show the bars
        chart.append('g')
            .selectAll('g')
            .data(data)
            .join('rect')
            .attr('fill', d => color(category))
            .attr('x', d => x(0))
            .attr('y', d => y(d.Name))
            .attr('height', d => y.bandwidth())
            .attr('stroke', 'black')
            .attr('stroke-width', '.5')
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

        // Animation
        chart.selectAll('rect')
            .transition()
            .duration(1000)
            .attr('width', d => x(d.Abundance))
            .delay(function (d, i) {
                return (i * 75)
            })

        // Fix svg dimension
        svg.attr('width', chart.node().getBBox().width + margin.left + margin.right)
            .attr('height', chart.node().getBBox().height + margin.top + margin.bottom);

        // Fix y-axis position
        chart.attr('transform', `translate(${yWidth + margin.left},${margin.top})`)

        if (yWidth) {
            // Fix title position
            title.attr('x', yWidth + margin.left + (width - yWidth) / 2);
        }
    }
};

$(document).ready(async function () {
    object.rawData = await d3.csv('/first-assignment/csv/geo_data_trees_neighborhoods.csv');

    $(window).resize(function () {
        if (currentWidth !== window.innerWidth) {
            currentWidth = window.innerWidth;
            $(multiContainer).html('');
            // Disegno tutti i grafici
            object.getSubgroups().forEach(function (category) {
                object.drawChart(multiContainer, category);
            });
        }
    });

    $(window).resize();
});
