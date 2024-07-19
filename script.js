document.addEventListener('DOMContentLoaded', (event) => {
    let line1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        mode: 'markers',
        type: 'scatter'
    };

    let data = [line1];

    Plotly.newPlot('scatterPlot', data);
});
