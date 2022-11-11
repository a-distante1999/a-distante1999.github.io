const margin = { top: 30, right: 30, bottom: 30, left: 60 };

const object = {
    rawData: [],
    drawChart: function (selector) {
        // Copio i dati
        let data = []
        this.rawData.forEach((row, index) => {
            data[index] = parseInt(row.Height);
        });

        // Set chart dimensions
        const height = 600 - margin.top - margin.bottom;
        const width = 600 - margin.left - margin.right;

        // append the svg object to the body of the page
        const svg = d3.select(selector)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Compute summary statistics used for the box:
        const dataSorted = data.sort(d3.ascending)
        const q1 = d3.quantile(dataSorted, .25)
        const median = d3.quantile(dataSorted, .5)
        const q3 = d3.quantile(dataSorted, .75)
        const interQuantileRange = q3 - q1
        const min = q1 - 1.5 * interQuantileRange
        const max = q1 + 1.5 * interQuantileRange

        // Show the Y scale
        const y = d3.scaleLinear()
            .domain([min * 1.75, max * 1.25])
            .range([height, 0]);
        svg.call(d3.axisLeft(y))

        // a few features for the box
        const center = 200
        widthBox = 100

        // Show the main vertical line
        svg.append('line')
            .attr('x1', center)
            .attr('x2', center)
            .attr('y1', y(min))
            .attr('y2', y(max))
            .attr('stroke', 'black')

        // Show the box
        svg.append('rect')
            .attr('x', center - widthBox / 2)
            .attr('y', y(q3))
            .attr('height', (y(q1) - y(q3)))
            .attr('width', widthBox)
            .attr('stroke', 'black')
            .style('fill', '#69b3a2')

        // show median, min and max horizontal lines
        svg.selectAll('toto')
            .data([min, median, max])
            .enter()
            .append('line')
            .attr('x1', center - widthBox / 2)
            .attr('x2', center + widthBox / 2)
            .attr('y1', function (d) { return (y(d)) })
            .attr('y2', function (d) { return (y(d)) })
            .attr('stroke', 'black')
    }
}

$(document).ready(async function () {
    object.rawData = await d3.csv('/second-assignment/csv/geo_data_trees_list.csv');

    $(window).resize(function () {
        if (currentWidth !== window.innerWidth) {
            currentWidth = window.innerWidth;
            $(singleContainer).html('');
            object.drawChart(singleContainer);
        }
    });

    $(window).resize();
});
