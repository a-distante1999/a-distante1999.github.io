let currentWidth = 0;
let bool = 0;

const margin = { top: 30, right: 30, bottom: 30, left: 200 };
const getHeight = (d) => parseFloat(d.length || d) * 30; //30 è l'altezza di ogni barra
const getWidth = (e) => parseFloat(d3.select(e).style('width')) - margin.right - margin.left; //

function DrawChartNeighborhoodsPercentage(chartSelector, legendSelector) {
    d3.csv("/csv/geo_data_trees_neighborhoods_percentage.csv").then(function (data) {
        const subNeighborhoods = data.columns.slice()
        const Neighborhoods = data.map(d => (d.Neighborhood))
        const height = getHeight(data);
        const width = getWidth(chartSelector);

        const svg = d3.select(chartSelector)
            .html('')
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, 100])
            .rangeRound([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        const y = d3.scaleBand()
            .domain(Neighborhoods)
            .range([height, 0])
            .padding([0.1]); // Spaziatura barre
        svg.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0))

        // Color palette = one color per subNeighborhood
        const color = d3.scaleOrdinal()
            .domain(subNeighborhoods)
            .range(['#A63CB3', '#FD4B84', '#FA9832', '#31EE82', '#28A2DC', '#5366D7'])

        // Stack the data 
        const stackedData = d3.stack()
            .keys(subNeighborhoods)
            (data)

        //TOOLTIP
        const tooltip = d3.select(chartSelector) //La definizione di questa classe è nel css
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        // Show the bars
        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", d => color(d.key))
            .attr("class", d => "myRect " + d.key)
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("y", d => y(d.data.Neighborhood))
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("height", y.bandwidth())
            .attr("stroke", "grey")
            .on("mouseover", function (event, d) { // What happens when user hover a bar
                // what subgroup are we hovering?
                const subGroupName = d3.select(this.parentNode).datum().key
                const subgroupValue = d.data[subGroupName];
                let valueCut = subgroupValue
                valueCut = parseFloat(valueCut).toFixed(2);
                let tree = subGroupName.replaceAll('_', ' ');

                tooltip
                    .html("Tree: " + tree + "<br>" + "Percentage: " + (valueCut) + "%")
                    .style("display", "block");

                // Reduce opacity of all rect to 0.2
                d3.selectAll(".myRect").style("opacity", 0.2)

                // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
                d3.selectAll("." + subGroupName)
                    .style("opacity", 1)
            })
            .on("mousemove", function (event, d) { // When user do not hover anymore
                let height = parseFloat(tooltip.style('height')); //Serve ad agganciare il fumetto nell'angolo in basso a sx

                tooltip
                    .style("left", (event.x) + "px")
                    .style("top", (event.y - height) + "px")
            })
            .on("mouseleave", function (event, d) { // When user do not hover anymore
                // Back to normal opacity: 1
                d3.selectAll(".myRect")
                    .style("opacity", 1)
                tooltip.style("display", "none");
            })

        // Legend
        if (bool == 0) {
            let neighborhood = 'BONDONE';
            let thedata = []
            data.forEach(function (row) {
                if (row.Neighborhood == neighborhood) {
                    Object.keys(row).slice(1, 7).forEach(function (tree) {
                        thedata.push({ 'Tree': tree, 'Abundance': row[tree] });
                    })
                }
            });

            var legend = d3.select(legendSelector)
                .append("svg")
                .style('margin-top', '50px')
                .attr('width', 300)
                .attr('height', 200)
                .append('g')
                .attr("font-family", "Fira Sans")
                .selectAll("div")
                .data(thedata)
                .enter()
                .append("g")
                .attr('transform', function (d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function (d, i) { return color(i) });

            legend.append("text")
                .attr("x", 25)
                .attr("y", 13)
                .text(d => d.Tree.replaceAll('_', ' '));
            bool = 1;
        }

    })
}

$(document).ready(function () {
    $(window).resize();
});

$(window).resize(function () {
    if (currentWidth !== window.innerWidth) {
        currentWidth = window.innerWidth;
        DrawChartNeighborhoodsPercentage('.chart', '.legend');
    }
});
