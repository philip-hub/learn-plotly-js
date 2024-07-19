document.addEventListener('DOMContentLoaded', (event) => {

    let line1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        mode: 'markers',
        type: 'scatter'
    };

    let data = [line1];

    Plotly.newPlot('scatterPlot1', data);

    let line2 = {
        x: [2,3,4,5],
        y: [16,5,11,9],
        mode: 'lines',
        type: 'scatter',
    }

    let line3 = {
        x:[1,2,3,4],
        y:[12,9,15, 12],
        mode: 'line+markers',
        type:'scatter'
    }

    let data2 = [line1, line2, line3]

    Plotly.newPlot('scatterPlot2', data2)


});
