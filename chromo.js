document.addEventListener('DOMContentLoaded', (event) => {
    function generateData(numPoints, numChromosomes) {
        const x = [];
        const logRatio = [];
        const bAlleleFrequency = [];
        const chromosomes = [];

        for (let chr = 1; chr <= numChromosomes; chr++) {
            for (let i = 0; i < numPoints; i++) {
                const value = Math.random() * 4 - 2; // random numbers between -2 and 2
                const baf = Math.random(); // generate random values

                x.push(i + (chr - 1) * numPoints);
                logRatio.push(value);
                bAlleleFrequency.push(baf);
                chromosomes.push(chr);
            }
        }

        return { x, logRatio, bAlleleFrequency, chromosomes };
    }

    const chromoData = generateData(1000, 24);

    const trace1 = {
        x: chromoData.x,
        y: chromoData.logRatio,
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 2,
            color: chromoData.chromosomes,
            colorscale: 'Viridis'
        },
        name: 'Log Ratio'
    };

    const layout5 = {
        title: 'Log Ratio',
        xaxis: {
            title: 'Genomic Position'
        },
        yaxis: {
            title: 'log ratio',
            range: [-2, 2]
        },
        shapes: [] // Initial empty shapes array for vertical lines
    };

    Plotly.newPlot('plotLogRatio', [trace1], layout5);

    const trace2 = {
        x: chromoData.x,
        y: chromoData.bAlleleFrequency,
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 2,
            color: chromoData.chromosomes,
            colorscale: 'Viridis'
        },
        name: 'B Allele Frequency'
    };

    const layout6 = {
        title: 'B Allele Frequency',
        xaxis: {
            title: 'Chromosomes',
            tickvals: Array.from({ length: 24 }, (_, i) => i * 1000 + 500),
            ticktext: Array.from({ length: 24 }, (_, i) => i + 1)
        },
        yaxis: {
            title: 'B Allele Frequency',
            range: [0, 1],
            tickvals: [0, 0.25, 0.333, 0.5, 0.667, 0.75, 1],
            ticktext: ['0', '1/4', '1/3', '1/2', '2/3', '3/4', '1']
        },
        shapes: [] // Initial empty shapes array for vertical lines
    };

    Plotly.newPlot('plotAllFreq', [trace2], layout6);

    function highlightPoint(pointIndex) {
        const highlightColor = 'red';
        const xValue = chromoData.x[pointIndex];
        const logRatioValue = chromoData.logRatio[pointIndex];
        const bAlleleFrequencyValue = chromoData.bAlleleFrequency[pointIndex];
        const chromosome = chromoData.chromosomes[pointIndex];
        const chrStart = (chromosome - 1) * 1000;
        const chrEnd = chromosome * 1000 - 1;

        const trace1Highlight = {
            x: [xValue],
            y: [logRatioValue],
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 10,
                color: highlightColor
            },
            name: `Selected Point`
        };

        const trace2Highlight = {
            x: [xValue],
            y: [bAlleleFrequencyValue],
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 10,
                color: highlightColor
            },
            name: `Selected Point`
        };

        // Add vertical lines to both plots
        layout5.shapes = [
            {
                type: 'line',
                x0: chrStart,
                x1: chrStart,
                y0: -2,
                y1: 2,
                line: {
                    color: 'blue',
                    width: 2,
                    dash: 'dot'
                }
            },
            {
                type: 'line',
                x0: chrEnd,
                x1: chrEnd,
                y0: -2,
                y1: 2,
                line: {
                    color: 'blue',
                    width: 2,
                    dash: 'dot'
                }
            }
        ];

        layout6.shapes = [
            {
                type: 'line',
                x0: chrStart,
                x1: chrStart,
                y0: 0,
                y1: 1,
                line: {
                    color: 'blue',
                    width: 2,
                    dash: 'dot'
                }
            },
            {
                type: 'line',
                x0: chrEnd,
                x1: chrEnd,
                y0: 0,
                y1: 1,
                line: {
                    color: 'blue',
                    width: 2,
                    dash: 'dot'
                }
            }
        ];

        Plotly.react('plotLogRatio', [trace1, trace1Highlight], layout5);
        Plotly.react('plotAllFreq', [trace2, trace2Highlight], layout6);

        // Update info box with the values
        const infoBox = document.getElementById('infoBox');
        infoBox.innerHTML = `Chromosome: ${chromosome}<br>Genomic Position: ${xValue}<br>Log Ratio: ${logRatioValue.toFixed(2)}<br>B Allele Frequency: ${bAlleleFrequencyValue.toFixed(2)}`;
    }

    document.getElementById('plotLogRatio').on('plotly_click', function(data) {
        const pointIndex = data.points[0].pointIndex;
        highlightPoint(pointIndex);
    });

    document.getElementById('plotAllFreq').on('plotly_click', function(data) {
        const pointIndex = data.points[0].pointIndex;
        highlightPoint(pointIndex);
    });
});
