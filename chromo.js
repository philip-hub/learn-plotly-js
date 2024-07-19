document.addEventListener('DOMContentLoaded', (event) => {
    function generateData(numPoints, numChromosomes) {
        const x = [];
        const logRatio = [];
        const bAlleleFrequency = [];
        const chromosomes = [];

        for (let chr = 1; chr <= numChromosomes; chr++) {
            for (let i = 0; i < numPoints; i++) {
                const value = Math.random() * 4 - 2; // random numbers between -1 and 1
                const baf = Math.random(); // generate random values

                x.push(i + (chr - 1) * numPoints);
                logRatio.push(value);
                bAlleleFrequency.push(baf);
                chromosomes.push(chr);
            }
        }

        console.log({ x, logRatio, bAlleleFrequency, chromosomes }); // Debugging log

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
        }
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
            title: 'Genomic Position'
        },
        yaxis: {
            title: 'B Allele Frequency',
            range: [0, 1],
            tickvals: [0, 0.25, 0.333, 0.5, 0.667, 0.75, 1],
            ticktext: ['0', '1/4', '1/3', '1/2', '2/3', '3/4', '1']
        }
    };

    Plotly.newPlot('plotAllFreq', [trace2], layout6);
});
