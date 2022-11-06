let currentWidth = 0;

const margin = { top: 30, right: 30, bottom: 30, left: 200 };

const getHeight = (d) => parseFloat(d.length || d) * 30; //30 è l'altezza di ogni barra
const getWidth = (e) => parseFloat(d3.select(e).style('width')) - margin.right - margin.left; //

function DrawChartCategories(chartSelector) {
    d3.csv("https://raw.githubusercontent.com/a-distante1999/a-distante1999.github.io/main/csv/geo_data_trees_categories.csv").then(data => {
        // Trasformo i dati in int e float perchè all'inizio i dati sono considerati stringa
        data.forEach((d) => {
            d.Abundance = parseInt(d.Abundance);
            d.Canopy = parseFloat(d.Canopy).toFixed(2); //toFixed serve a ottenere due cifre
        });

        // Ordino i dati
        data.sort((a, b) => b.Abundance - a.Abundance);

        // Taglio i dati
        data.length = 20

        // Serve a invertire i dati, se non ci fosse avrei il più abbondante in fondo
        data.reverse()

        // set chart dimensions
        const height = getHeight(data);
        const width = getWidth(chartSelector);

        // append the svg object to the body of the page (crea il container del grafico)
        const svg = d3.select(chartSelector)
            .html('')
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Abundance)])
            .range([0, width]);

        // Scrive i numeri sull'asse
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        const y = d3.scaleBand()
            .domain(data.map(d => d.Name))
            .range([height, 0])
            .padding([0.1]); // Spaziatura barre

        svg.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0));
        /*
                    // color palette = one color per subgroup
                    const color = d3.scaleOrdinal()
                                    .domain(data)
                                    .range(d3.schemeSet1);
        */
        const tooltip = d3.select(chartSelector) //La definizione di questa classe è nel css
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        const mouseover = function (event, d) {
            tooltip.html('Abundance: ' + d.Abundance + '<br>' + 'Canopy (avg.): ' + d.Canopy + ' m<sup>2</sup>')
                .style("display", "block");
        }

        const mousemove = function (event, d) { //Serve a far seguire il mouse over
            let height = parseFloat(tooltip.style('height')); //Serve ad agganciare il fumetto nell'angolo in basso a sx

            tooltip
                .style("left", (event.x) + "px")
                .style("top", (event.y - height) + "px")
        }

        const mouseleave = function (event, d) {
            tooltip.style("display", "none");
        }
        
        var myColor = d3.scaleSequential().domain([1,600])
        .interpolator(d3.interpolateYlGn);
        

        // Show the bars
        svg.selectAll("mybar")
            .data(data) //Quali sono i dati del grafico
            .join("rect")
            //.attr("fill", "rgb(12,240,233)") //Colore barretta
            .attr("fill", function(d){ return myColor(Math.floor( d.Abundance))})
            .attr("x", d => x(0))
            .attr("y", d => y(d.Name)) //Posizione della barra sull'asse y
            //.attr("width", d => x(d.Abundance))  Se metto solo questo, non fa l'animazione
            .attr("height", d => y.bandwidth()) //Dimensione automatica della dimensione della barra
            .attr("stroke", "black") // Colore del bordo
            .attr("stroke-width", ".5") //Spessore bordo
            .on("mouseover", mouseover) //All'evento mouse over, chiamo la funzone mouse over
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        // Animazione del grafico
        svg.selectAll("rect")
            .transition()
            .duration(1000)
            //.attr("x", d => x(0))
            //.attr("y", d => y(d.Name))
            .attr("width", d => x(d.Abundance))
            //.attr("height", d => y.bandwidth())
            .delay(function (d, i) {
                return (i * 75)
            })
    });
}

$(document).ready(function () {
    $(window).resize();
});

$(window).resize(function () {
    if (currentWidth !== window.innerWidth) {
        currentWidth = window.innerWidth;
        DrawChartCategories('.chart');
    }
});