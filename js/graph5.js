const waffleObject = {
    rawData: [],
    generateColor: d3.scaleOrdinal().range(['#A63CB3', '#FD4B84', '#FA9832', '#31EE82', '#28A2DC', '#5366D7']),
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
    drawChart: function (selector, neighborhood, clean) {
        var total = 0;
        var width,
            height,
            widthSquares = 10,
            heightSquares = 10,
            squareSize = 20,
            squareValue = 0,
            gap = 2,
            thewaffle = [];

        let waffleData = this.getNeighborhoodData(neighborhood);

        total = d3.sum(waffleData, function (d) { return d.Abundance; });

        if (!total || !selector) {
            return;
        }

        //value of a square
        squareValue = total / (widthSquares * heightSquares);

        waffleData.forEach(function (d, i) {
            let unit = parseFloat((d.Abundance / squareValue).toFixed(10));
            d['Integer'] = Math.floor(unit);
            d['Decimal'] = parseFloat((unit - Math.floor(unit)).toFixed(10));
        })

        let mergedData = []
        for (let i = 0; i < waffleData.length; i++) {
            let unit = parseFloat((waffleData[i].Abundance / squareValue).toFixed(10));
            mergedData[i] = [
                waffleData[i],
                { "Integer": Math.floor(unit) },
                { "Decimal": parseFloat((unit - Math.floor(unit)).toFixed(10)) }
            ].reduce(function (r, o) {
                Object.keys(o).forEach(function (k) { r[k] = o[k]; });
                return r;
            }, {});
        }
        mergedData.sort(function (a, b) {
            return b.Decimal - a.Decimal;
        });

        let tot = d3.sum(mergedData, function (d) { return d.Integer; });

        for (let i = 0; i < 100 - tot; i++) {
            mergedData[i].Integer += 1
        }

        //remap waffle
        mergedData.forEach(function (d, i) {
            d.Abundance = +d.Abundance;
            thewaffle = thewaffle.concat(
                Array(d.Integer + 1).join(1).split('').map(function () {
                    return {
                        squareValue: squareValue,
                        Units: d.Integer,
                        Abundance: d.Abundance,
                        Tree: d.Tree,
                        GroupIndex: i
                    };
                })
            );
        });

        width = (squareSize * widthSquares) + widthSquares * gap + 25;
        height = (squareSize * heightSquares) + heightSquares * gap + 25;

        const waffle = d3.select(selector);

        if (clean) {
            waffle.html('')
        }

        waffle
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "rotate(90)")
            .append("g")
            .selectAll("div")
            .data(thewaffle)
            .enter()
            .append("rect")
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("fill", d => this.generateColor(d.GroupIndex))
            .attr("x", function (d, i) {
                //group n squares for column
                col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr("y", function (d, i) {
                row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            })
            .append("title")
            .text(function (d, i) {
                return d.Tree.replaceAll('_', ' ') + ": " + d.Abundance + " (" + d.Units + "%)"
            });

        this.drawLegend()
    },
    drawLegend: function (selector, neighborhood) {
        if (!selector) {
            return;
        }

        let data = this.getNeighborhoodData(neighborhood);

        //add legend with categorical waffle
        const legend = d3.select(selector)
            .html('')
            .append("svg")
            .attr('width', 300)
            .attr('height', 200)
            .append('g')
            .attr("font-family", "Fira Sans")
            .selectAll("div")
            .data(data)
            .enter()
            .append("g")
            .attr('transform', function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", (d, i) => this.generateColor(i));

        legend.append("text")
            .attr("x", 25)
            .attr("y", 13)
            .text(d => d.Tree);
    },
    drawNeighborhoods: function (selector) {
        this.rawData.forEach((row, index) => {
            // Estraggo i dati relativi alla circoscrizione
            let data = this.getNeighborhoodData(row.Neighborhood);
            // Verifico se la circoscrizione contiene alberi al suo interno
            let total = d3.sum(data, function (d) { return d.Abundance; });

            if (total > 0) {
                // Se ci sono alberi allora creo il selettore
                const input = $(document.createElement("input"))
                    .attr('type', 'radio')
                    .attr('name', 'neighborhood')
                    .attr('value', row.Neighborhood)
                    .attr('id', row.Neighborhood)
                    .on('change', (e) => {
                        this.drawChart('.chart', $(e.currentTarget).attr('value'), true)
                        this.drawLegend('.legend', row.Neighborhood)
                    })

                if (index == 0) {
                    input.attr('checked', '')
                }

                const label = $(document.createElement("label"))
                    .attr("font-family", "Fira Sans")
                    .attr('for', row.Neighborhood)
                    .html(row.Neighborhood + '<br>')

                $(selector).append(input);
                $(selector).append(label);
            }
        });
    }
};

$(document).ready(async function () {
    waffleObject.rawData = await d3.csv("https://raw.githubusercontent.com/a-distante1999/a-distante1999.github.io/main/csv/geo_data_trees_neighborhoods.csv")

    waffleObject.rawData.forEach(function (d, _) {
        waffleObject.drawChart('.all-charts', d.Neighborhood);
    });

    waffleObject.drawNeighborhoods('.neighborhoods')

    $('.neighborhoods').find('input').first().trigger('change');
});
