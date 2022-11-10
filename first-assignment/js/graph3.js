let minWidth = 0;

const margin = { top: 30, right: 0, bottom: 0, left: 0 };

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

        // Incapsulo il selettore in un div
        selector = d3.select(selector)
            .append('div')
            .attr('class', 'container')
            .node();

        // Set chart dimensions
        const height = getHeight(data);

        // TODO: rivedere la width
        const width = minWidth - 50 - margin.left - margin.right;

        // Add tooltip
        const tooltip = d3.select(selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        // Append the svg object
        const svg = d3.select(selector)
            .append('svg')
            .attr('class', 'bar-chart');

        let title = null;

        if (category) {
            title = svg.append('text')
                .attr('y', 10)
                .attr('x', '50%')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .text(category);
        }

        const chart = svg.append('g');

        // Add Y axis
        const y = d3.scaleBand()
            .domain(data.map(d => d.Name))
            .range([0, height])
            .padding([0.1]);

        const yAxis = chart.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).tickSizeOuter(0))

        const yWidth = !category ? yAxis.node().getBBox().width : 0;

        if (!minWidth) {
            minWidth = (currentWidth - yWidth) / (subgroups.length);
        }

        if (!category) {
            // Mi serve per correggere successivamente l'altezza
            this.yChart = svg;
        }
        else {
            if (title) {
                title.attr('transform', `translate(${yWidth}, 0)`)
            }

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

            if (this.yChart) {
                // Correggo l'altezza dell'asse delle Y
                this.yChart.attr('height', chart.node().getBBox().height + margin.top + margin.bottom)
            }
        }

        // Fix svg dimension
        svg.attr('width', chart.node().getBBox().width + margin.left + (category ? margin.right : 0))
            .attr('height', chart.node().getBBox().height + margin.top + margin.bottom);

        // Fix y-axis position
        chart.attr('transform', `translate(${yWidth + margin.left},${margin.top})`)
    }
};

$(document).ready(async function () {
    object.rawData = await d3.csv('/first-assignment/csv/geo_data_trees_neighborhoods.csv');

    $(window).resize(function () {
        if (currentWidth !== window.innerWidth) {
            currentWidth = window.innerWidth;
            $(multiContainer).html('');
            // Disegno l'asse delle Y
            object.drawChart(multiContainer);
            // Disegno tutti i grafici
            object.getSubgroups().forEach(function (category) {
                object.drawChart(multiContainer, category);
            });
        }
    });

    $(window).resize();
});
