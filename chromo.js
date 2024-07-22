document.addEventListener('DOMContentLoaded', (event) => {
    // Box-Muller Transform to generate random numbers with a normal distribution
    function boxMullerTransform() {
        const u = Math.random();
        const v = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z0;
    }

    function generateData(numPoints, numChromosomes) {
        const x = [];
        const logRatio = [];
        const bAlleleFrequency = [];
        const chromosomes = [];

        for (let chr = 1; chr <= numChromosomes; chr++) {
            for (let i = 0; i < numPoints; i++) {
                const value = boxMullerTransform(); // Use Box-Muller for normal distribution
                const baf = Math.random(); // generate random values between 0 and 1

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
            title: 'Genomic Position',
            tickvals: Array.from({ length: 24 }, (_, i) => i * 1000 + 500),
            ticktext: Array.from({ length: 24 }, (_, i) => i + 1)
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

    function highlightPoint(pointIndex, pointData, plotId) {
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

        // Update and show info box with the values
        const infoBoxContent = document.getElementById('infoBoxContent');
        const infoBox = document.getElementById('infoBox');
        infoBoxContent.innerHTML = `Chromosome: ${chromosome}<br>Genomic Position: ${xValue}<br>Log Ratio: ${logRatioValue.toFixed(2)}<br>B Allele Frequency: ${bAlleleFrequencyValue.toFixed(2)}`;

        // Get the position of the clicked point
        const xPos = pointData.xaxis.l2p(pointData.x) + pointData.xaxis._offset;
        const yPos = pointData.yaxis.l2p(pointData.y) + pointData.yaxis._offset;

        // Get the bounding rectangle of the plot
        const plotRect = document.getElementById(plotId).getBoundingClientRect();

        // Set the position of the info box
        infoBox.style.top = `${plotRect.top + window.scrollY + yPos - infoBox.offsetHeight - 10}px`; // 10px space above the point
        infoBox.style.left = `${plotRect.left + window.scrollX + xPos + 10}px`; // 10px space to the right of the point

        infoBox.style.display = 'block';
    }

    document.getElementById('plotLogRatio').on('plotly_click', function(data) {
        const pointIndex = data.points[0].pointIndex;
        highlightPoint(pointIndex, data.points[0], 'plotLogRatio');
    });

    document.getElementById('plotAllFreq').on('plotly_click', function(data) {
        const pointIndex = data.points[0].pointIndex;
        highlightPoint(pointIndex, data.points[0], 'plotAllFreq');
    });

    // Make the info box draggable
    dragElement(document.getElementById("infoBox"));

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "Header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
