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
    let selectedPoints = []; // To track selected points

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

    function highlightMultiplePoints() {
        if (selectedPoints.length === 0) return;

        let sumLogRatio = 0;
        let sumBAlleleFrequency = 0;

        selectedPoints.forEach(point => {
            sumLogRatio += chromoData.logRatio[point.index];
            sumBAlleleFrequency += chromoData.bAlleleFrequency[point.index];
        });

        const avgLogRatio = sumLogRatio / selectedPoints.length;
        const avgBAlleleFrequency = sumBAlleleFrequency / selectedPoints.length;

        // Update and show multiple points info box with the values
        const multiInfoBoxContent = document.getElementById('multiInfoBoxContent');
        const multiInfoBox = document.getElementById('multiInfoBox');
        multiInfoBoxContent.innerHTML = `Selected Points: ${selectedPoints.length}<br>Avg Log Ratio: ${avgLogRatio.toFixed(2)}<br>Avg B Allele Frequency: ${avgBAlleleFrequency.toFixed(2)}`;

        // Set the position of the info box
        const lastPoint = selectedPoints[selectedPoints.length - 1];
        const xPos = lastPoint.xaxis.l2p(lastPoint.x) + lastPoint.xaxis._offset;
        const yPos = lastPoint.yaxis.l2p(lastPoint.y) + lastPoint.yaxis._offset;

        // Get the bounding rectangle of the plot
        const plotRect = document.getElementById(lastPoint.plotId).getBoundingClientRect();

        multiInfoBox.style.top = `${plotRect.top + window.scrollY + yPos - multiInfoBox.offsetHeight - 10}px`; // 10px space above the point
        multiInfoBox.style.left = `${plotRect.left + window.scrollX + xPos + 10}px`; // 10px space to the right of the point

        multiInfoBox.style.display = 'block';
    }

    document.getElementById('plotLogRatio').on('plotly_click', function(data) {
        if (data.event.shiftKey) {
            selectedPoints.push({ index: data.points[0].pointIndex, ...data.points[0], plotId: 'plotLogRatio' });
            highlightMultiplePoints();
        } else {
            selectedPoints.length = 0;
            const pointIndex = data.points[0].pointIndex;
            highlightPoint(pointIndex, data.points[0], 'plotLogRatio');
        }
    });

    document.getElementById('plotAllFreq').on('plotly_click', function(data) {
        if (data.event.shiftKey) {
            selectedPoints.push({ index: data.points[0].pointIndex, ...data.points[0], plotId: 'plotAllFreq' });
            highlightMultiplePoints();
        } else {
            selectedPoints.length = 0;
            const pointIndex = data.points[0].pointIndex;
            highlightPoint(pointIndex, data.points[0], 'plotAllFreq');
        }
    });

    // Close the info box when the close button is clicked
    document.getElementById('closeBtn').onclick = function() {
        document.getElementById('infoBox').style.display = 'none';
    };

    // Close the multiple points info box when the close button is clicked
    document.getElementById('closeMultiBtn').onclick = function() {
        document.getElementById('multiInfoBox').style.display = 'none';
        selectedPoints.length = 0;
    };

    // Make the info box draggable
    dragElement(document.getElementById("infoBox"));
    dragElement(document.getElementById("multiInfoBox"));

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
