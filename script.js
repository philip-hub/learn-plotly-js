
document.addEventListener('DOMContentLoaded', (event) => {


    function fitMathFunc(){
        const x = []
        const y = []
        
        for(let i = 0; i <= 100; i++){
            const xValue = i / 10;
            const yValue = Math.sin(xValue); // Calculate y = sin(x)
            x.push(xValue);
            y.push(yValue);
        }
        
        return { x, y };
    }
        
        

    let line1 = {
        x: [1, 2, 3, 4, 5],
        y: [1, 6, 3, 6, 1],
        mode: 'markers',
        type: 'scatter',
        name: 'Team A',
        text: ['A-1','A-2','A-3','A-4','A-5'],
        textposistion: 'top center',
        textfont:{
            family: 'Raleway, Sans-serif'
        },
        marker: {size : 12}

    };

    let data = [line1];

    Plotly.newPlot('scatterPlot1', data);

    let line2 = {
        x: [2,3,4,5],
        y: [4,1,7,1,4],
        mode: 'markers',
        type: 'scatter',
        name: 'Team B',
        text: ['B-1','B-2','B-3','B-4','B-5'],
        textposistion: 'bottom center',
        textfont:{
            family: 'Raleway, Sans-serif'
        },
        marker: {size : 12}
    }

    let line3 = {
        x:[1,2,3,4],
        y:[12,9,15, 12],
        mode: 'line+markers',
        type:'scatter'
    }

    let data2 = [line1, line2]


    let layout = {
        xaxis: {
            range: [.75,5.25]
        },
        yaxis: {
            range: [0,8]
        },

        legend:{
            y: 0.5,
            yref: 'paper',
            font:{
                family: 'Arial, sans-serif',
                size: 20,
                color: 'grey',
            }
        },

        title:'Data Labels on the Plot'

    };

    Plotly.newPlot('scatterPlot2', data2,layout)

//log plot

let line4 = {
    x:[0,1,2,3,4,5,6,7,8],
    y:[0,1,2,3,4,5,6,,7,8],
    type: 'scatter'
};

let line5 = {
    x:[0,1,2,3,4,5,6,7,8],
    y:[8,7,6,5,4,3,2,1,0],
    type: 'scatter'
}

let data3 = [line4,line5]

let layout2 = {
    xaxis:{
        type: 'log',
        autorange: true
    },
    yaxis:{
        type:'log',
        autorange: true
    }

};

    Plotly.newPlot('logPlot', data3,layout2)


    const data4 = fitMathFunc();

    const trace = {
        x: data4.x,
        y: data4.y,
        mode: 'lines',
        type: 'scatter'
    };
    
    const layout4 = {
        title:"plot of sin(x)",
        xaxis:{
            title:'x'
        },
        yaxis:{
            title:'y'
        }

    };

    Plotly.newPlot('funcPlot', [trace], layout4);

});



