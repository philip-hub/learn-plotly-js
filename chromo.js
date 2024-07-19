document.addEventListener('DOMContentLoaded', (event) => {

function generateData(numPoints, numChromosomes){
    const x = [];
    const logRatio = [];
    const bAlleleFrequency = [];
    const chromosomes = [];

    for(let chr = 1; chr <= numChromosomes; chr++) {
        for(let i =0; i<numPoints; i++){
            const value = Math.random()*2 -1 //random numbers between -1 and 1

            const baf = Math.random(); //generate random values

            x.push(i+(chr-1)*numPoints);
            logRatio.push(value);
            bAlleleFrequency.push(baf);
            chromosomes.push(chr);
        }
    }
    return {x, logRatio, bAlleleFrequency, chromosomes};
}
    

const chromoData = generateData(1000,24);

const trace1 = {
    x: chromoData.x,
    y: chromoData.logRatio,
    mode: 'markers',
    type: 'scatter',
    marker:{
        size:2,
        color: chromoData.chromosomes,
        colorscale: 'Viridis'
    },
    name: 'Log Ratio'
};

const layout5 = {
    title:'Log Ratio',
    xaxis:{
        title:'Genomic Position'
    },
    yaxis: {
        title: 'log ratio',
        range: [-2,2],
    }
};

Plotly.newPlot('plotLogRatio',[trace1],[layout5])

const trace2 = {
    x:chromoData.x,
    y:chromoData.bAlleleFrequency,
    mode:'markers',
    type:'scatter',
    marker:{
        size: 2,
        color: chromoData.chromosomes,
        colorscale: 'Viridis',

    },
    name: 'B Allele Frequency'
}

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
    },
    legend: {
        x: 1.05, // Position legend to the right of the plot
        y: 0.5,
        traceorder: 'normal',
        font: {
            family: 'sans-serif',
            size: 12,
            color: '#000'
        },
        bgcolor: '#E2E2E2',
        bordercolor: '#FFFFFF',
        borderwidth: 2
    }
};

Plotly.newPlot("plotAllFreq",[trace2],[layout6])

});