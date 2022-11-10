const margin = { top: 30, right: 30, bottom: 30, left: 60 };

const object = {
    rawData: [],
    drawChart: function (selector) {
        let data = [];
        this.rawData.forEach(row => {
            // Copio i dati
            let obj = { ...row };
            // Converti i valori numerici
            Object.keys(row).forEach((key) => {
                let value = parseFloat(obj[key])
                if (!isNaN(value)) {
                    obj[key] = value;
                }
            });
            // Inserisco l'oggetto nella lista
            data.push(obj);
        });

        // Riordino i dati in base alla quantità
        data.sort((a, b) => (b.Abundance - a.Abundance))

        function update(nTrees) {
            // Fix the number of trees
            if (nTrees > data.length) {
                nTrees = data.length;
            }
            else if (nTrees < 1) {
                nTrees = 1;
            }

            // Taglio e tengo solo i primi nTrees alberi
            let newData = data.slice(0, nTrees)

            const height = 600 - margin.top - margin.bottom;
            const width = getWidth(selector) - margin.left - margin.right;

            // Valore massimo scala delle X
            const xMax = d3.max(newData, d => d.Height);
            // Valore massimo scala delle Y
            const yMax = d3.max(newData, d => d.Carbon);
            // Valore massimo scala delle Z
            const zMax = d3.max(newData, d => d.Canopy);

            // append the svg object to the body of the page
            const svg = d3.select(selector)
                .html('')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Add X axis
            const x = d3.scaleLinear()
                .domain([0 - (xMax / 20), xMax + (xMax / 20)])
                .range([0, width]);

            svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0 - (yMax / 20), yMax + (yMax / 20)])
                .range([height, 0]);

            svg.append('g')
                .call(d3.axisLeft(y));

            // Add a scale for bubble size
            const z = d3.scaleLinear()
                .domain([0 - (zMax / 20), zMax + (zMax / 20)])
                .range([4, 20]);

            // Add a scale for bubble color
            const color = function (i) {
                return d3.interpolateWarm(i / newData.length)
            };

            // -1- Create a tooltip div that is hidden by default:
            const tooltip = d3.select(selector)
                .append('div')
                .attr('class', 'tooltip')
                .style('display', 'none');

            // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
            const mouseover = function (event, d) {
                tooltip.html(`Tree: ${d.Name}<br>Abundance: ${d.Abundance}<br>Canopy size (avg.): ${d.Canopy.toFixed(2)} m<sup>2</sup><br>Carbon storage (avg.): ${d.Carbon.toFixed(2)} kg`)
                    .style('display', 'block')
            }

            const mousemove = function (event, d) {
                d3.select(event.target)
                    .attr('stroke-width', '1');

                tooltip.style('left', `${event.x}px`)
                    .style('top', `${event.y - (parseFloat(tooltip.style('height')) * 5 / 4)}px`)
            }

            const mouseleave = function (event, d) {
                d3.select(event.target)
                    .attr('stroke-width', '0');

                tooltip.style('display', 'none');
            }

            // Add dots
            svg.append('g')
                .selectAll('dot')
                .data(newData)
                .join('circle')
                .attr('class', 'bubbles')
                .attr('stroke', 'black')
                .attr('stroke-width', '0')
                .attr('cx', d => x(d.Height))
                .attr('cy', d => y(d.Carbon))
                .attr('r', d => z(d.Canopy))
                .style('fill', (d, i) => color(i))
                // -3- Trigger the functions
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave)
        }

        update(data.length)

        // Listen to the button -> update if user change it
        d3.select('#nTrees')
            .attr('max', data.length)
            .attr('value', data.length)
            .on('input', function () {
                update(+this.value);
            });
    }
};

$(document).ready(async function () {
    object.rawData = await d3.csv('/second-assignment/csv/geo_data_trees_categories_v2.csv');

    $(window).resize(function () {
        if (currentWidth !== window.innerWidth) {
            currentWidth = window.innerWidth;
            $(singleContainer).html('');
            object.drawChart(singleContainer);
        }
    });

    $(window).resize();
});
