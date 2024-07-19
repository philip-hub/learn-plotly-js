
document.addEventListener('DOMContentLoaded', (event) => {


    function fitMathFunc(){
        const x = []
        const y = []
        const text = []
        
        for(let i = 0; i <= 100; i++){
            const xValue = i / 10;
            const yValue = Math.sin(xValue); // Calculate y = sin(x)
            x.push(xValue);
            y.push(yValue);
            text.push("Sin Function")
        }
        
        return { x, y, text };
    }


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

});



