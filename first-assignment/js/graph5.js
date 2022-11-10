const margin = { top: 30, right: 15, bottom: 0, left: 15 };

const listNeighborhoods = '.list-neighborhoods';

const object = {
    rawData: [],
    getNeighborhoodData: function (neighborhood) {
        let data = []
        this.rawData.forEach(function (row) {
            if (row.Neighborhood === neighborhood) {
                Object.keys(row).slice(1, 6).forEach(function (tree) {
                    data.push({ 'Tree': tree, 'Abundance': parseInt(row[tree]) });
                })
            }
        });
        return data;
    },
    drawChart: function (selector, neighborhood, full) {
        const widthSquares = 10,
            heightSquares = 10,
            squareSize = 20,
            gap = 2;

        const neighborhoodData = this.getNeighborhoodData(neighborhood);

        let total = d3.sum(neighborhoodData, function (d) { return d.Abundance; });

        if (!total || !selector) {
            return;
        }

        // Valore del quadratino
        let squareValue = total / (widthSquares * heightSquares);

        let data = []
        for (let i = 0; i < neighborhoodData.length; i++) {
            // Copio i dati
            data[i] = { ...neighborhoodData[i] }

            let unit = parseFloat((data[i].Abundance / squareValue).toFixed(10));
            let integer = Math.floor(unit);

            // Aggiungo info ulteriori
            data[i]['Integer'] = integer;
            data[i]['Decimal'] = parseFloat((unit - integer).toFixed(10));
        }

        // Ordino per parte decimale
        data.sort(function (a, b) {
            return b.Decimal - a.Decimal;
        });

        let tot = d3.sum(data, function (d) { return d.Integer; });

        // Aggiungo gli elementi mancati per raggiungere il totale
        for (let i = 0; i < 100 - tot; i++) {
            data[i].Integer += 1
        }

        // Creo i quadratini del waffle
        let waffleSquares = [];
        data.forEach(function (d, i) {
            waffleSquares = waffleSquares.concat(
                Array(d.Integer + 1).join(1).split('').map(function () {
                    return {
                        Units: d.Integer,
                        Abundance: d.Abundance,
                        Tree: d.Tree,
                        /*Random: numberToWords.toWords((Math.random() * 5).toFixed(0))*/
                    };
                })
            );
        });

        // Set chart dimensions
        const width = (squareSize * widthSquares) + widthSquares * gap;
        const height = (squareSize * heightSquares) + heightSquares * gap;

        if (!full) {
            // Incapsulo il selettore in un div
            selector = d3.select(selector)
                .append('div')
                .attr('class', 'container')
                .node();
        }

        // Add tooltip
        const tooltip = d3.select(selector)
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        // Imposto l'ordine fisso (alfabetico) per avere sempre lo stesso colore
        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.Tree).sort((a, b) => a > b ? 1 : -1))
            .range(['#A63CB3', '#FD4B84', '#FA9832', '#31EE82', '#28A2DC', '#5366D7'])

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

            d3.selectAll('.myRect').style('opacity', 0.2)

            d3.selectAll(`.${sanitizeString(d.Tree)}`).style('opacity', 1)

            tooltip.html(`${d.Tree}: ${d.Abundance} (${d.Units}%)`)
                .style('display', 'block');
        }

        const mousemove = (event, d) => {
            let height = parseFloat(tooltip.style('height'));

            tooltip.style('left', `${event.x}px`)
                .style('top', `${event.y - (height * 2)}px`)
        }

        const mouseleave = (event, d) => {
            removeTimeout();

            timeout = setTimeout(() => {
                d3.selectAll('.myRect')
                    .style('opacity', 1)

                tooltip.style('display', 'none')
            }, 150)
        }

        d3.selectAll('.waffle-chart')
            .style('display', 'block')

        d3.selectAll(`.${sanitizeString(neighborhood)}`)
            .style('display', 'none')

        const chart = d3.select(selector)
            .append('svg')
            .attr('class', d => `waffle-chart ${sanitizeString(neighborhood)}`)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        // Add title
        const title = chart.append('text')
            .attr('class', 'title')
            .attr('y', 10)
            .attr('x', '50%')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(neighborhood);

        chart.append('g')
            .attr('transform', `translate(${width + (margin.left + margin.right) / 2},${margin.top}) rotate(90)`)
            .selectAll('div')
            .data(waffleSquares)
            .enter()
            .append('rect')
            .attr('class', (d) => `myRect ${sanitizeString(d.Tree)}` /*+ ' ' + sanitizeString(d.Random)*/)
            .attr('height', squareSize)
            .attr('fill', d => color(d.Tree))
            .attr('x', function (d, i) {
                let col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr('y', function (d, i) {
                let row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            })
            .attr('width', squareSize) // Commentare per l'animazione
            .attr('stroke', 'black')
            .attr('stroke-width', '.5')
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

        /*let randoms = []
        waffleSquares.forEach((d) => {
            if (!randoms.find(random => random == d.Random)) {
                randoms.push(d.Random)
            }
        });

        // Animazione
        randoms.forEach((random) => {
            // Animation
            chart.selectAll('.' + sanitizeString(random))
                .transition()
                .duration(100)
                .attr('width', squareSize)
                .delay(function (d, i) {
                    return (i * 75)
                })
        })*/

        if (full) {
            const svg = d3.select(selector)
                .append('svg')
                .attr('class', d => 'legend');

            const legend = svg.append('g');

            const rows = legend.selectAll('g')
                .data(neighborhoodData)
                .join('g')
                .attr('transform', (d, i) => `translate(0,${i * 20})`);

            rows.append('rect')
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', (d) => color(d.Tree));

            rows.append('text')
                .attr('x', 25)
                .attr('y', 15)
                .text(d => d.Tree);

            // Fix svg dimension
            svg.attr('width', legend.node().getBBox().width)
                .attr('height', legend.node().getBBox().height);
        }
    }
};

$(document).ready(async function () {
    object.rawData = await d3.csv('/first-assignment/csv/geo_data_trees_neighborhoods.csv')

    // Disegno la lista delle circoscrizioni
    object.rawData.forEach((row, index) => {
        // Estraggo i dati relativi alla circoscrizione
        let data = object.getNeighborhoodData(row.Neighborhood);
        // Verifico se la circoscrizione contiene alberi al suo interno
        let total = d3.sum(data, function (d) { return d.Abundance; });

        if (total > 0) {
            // Se ci sono alberi allora creo il selettore
            const input = $(document.createElement('input'))
                .attr('type', 'radio')
                .attr('name', 'neighborhood')
                .attr('value', row.Neighborhood)
                .attr('id', row.Neighborhood)
                .on('change', (e) => {
                    $(singleContainer).html('');
                    object.drawChart(singleContainer, $(e.target).attr('value'), true)
                })

            if (!index) {
                input.attr('checked', '')
            }

            const label = $(document.createElement('label'))
                .attr('for', row.Neighborhood)
                .html(`${row.Neighborhood}<br>`)

            $(listNeighborhoods).append(input);
            $(listNeighborhoods).append(label);
        }
    });

    // Disegno i grafici di tutte le circoscrizioni
    object.rawData.forEach(function (d) {
        object.drawChart(multiContainer, d.Neighborhood);
    });

    // Disegno la prima circoscrizione della lista
    $(listNeighborhoods).find('input').first().trigger('change');
});
