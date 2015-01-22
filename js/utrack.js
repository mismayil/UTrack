'use strict';

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.addEventListener('load', function() {

    var activityModel = new ActivityStoreModel();
    var graphModel = new GraphModel();
    var input_btn = document.getElementById('input_btn');
    var analysis_btn = document.getElementById('analysis_btn');
    var input_div = document.getElementById('input_div');
    var analysis_div = document.getElementById('analysis_div');
    var submit_btn = document.getElementById('submit_btn');
    var activityType = document.getElementById('activity_sel');
    var energy_level = document.getElementById('energy_level');
    var stress_level = document.getElementById('stress_level');
    var happiness_level = document.getElementById('happiness_level');
    var time_spent = document.getElementById('time_spent');
    var graph_table = document.getElementById('graph_table');
    var graph_bar = document.getElementById('graph_bar');
    var table_radio = document.getElementById('table_radio');
    var bar_radio = document.getElementById('bar_radio');
    var customize_div = document.getElementById('customize_div');
    var plot_btn = document.getElementById('plot_btn');

    activityModel.addListener(function(eventType, eventTime, activityDataPoint) {

        if (eventType == ACTIVITY_DATA_ADDED_EVENT) {
            addToTable(activityDataPoint);
            addTobarPlot(activityDataPoint, activityModel.getActivityDataPoints());
        } else if (eventType == ACTIVITY_DATA_CHANGED_EVENT) {
            changeTable(activityDataPoint);
            plotbar(activityModel.getActivityDataPoints());
        }
    });

    graphModel.addListener(function(eventType, eventTime, graphName) {
        var graphNames = graphModel.getAvailableGraphNames();
        var selectedGraph = document.getElementById(graphModel.getNameOfCurrentlySelectedGraph());
        selectedGraph.style.display = 'inline';

        _.each(
            graphNames,
            function(gname) {
                var graph = document.getElementById(gname);
                if (gname != graphName) {
                    graph.style.display = 'none';
                }
            }
        );
    });

    input_btn.addEventListener('click', function() {
        input_div.style.display = 'inline';
        input_btn.style.backgroundColor = 'blue';
        analysis_btn.style.backgroundColor = 'cornflowerblue';
        analysis_div.style.display = 'none';
    });

    analysis_btn.addEventListener('click', function() {
        input_div.style.display = 'none';
        analysis_btn.style.backgroundColor = 'blue';
        input_btn.style.backgroundColor = 'cornflowerblue';
        analysis_div.style.display = 'inline';
    });


    submit_btn.addEventListener('click', function() {
        if (isNaN(energy_level.value) || energy_level.value < 1 || energy_level.value > 5) {
            alert("Energy level should be a number between 1 and 5");
            energy_level.focus();
            return;
        }

        if (isNaN(stress_level.value) || stress_level.value < 1 || stress_level.value > 5) {
            alert("Stress level should be a number between 1 and 5");
            stress_level.focus();
            return;
        }

        if (isNaN(happiness_level.value) || happiness_level.value < 1 || happiness_level.value > 5) {
            alert("Happiness level should be a number between 1 and 5");
            happiness_level.focus();
            return;
        }

        if (isNaN(time_spent.value) || time_spent.value < 0) {
            alert("Time spent should be a number greater than 0");
            time_spent.focus();
            return;
        }

        var activityDataPoint = new ActivityData(
            activityType.value,
            {
                energyLevel: energy_level.value,
                stressLevel: stress_level.value,
                happinessLevel: happiness_level.value
            },
            time_spent.value
        );

        activityModel.addActivityDataPoint(activityDataPoint);

        energy_level.value = '';
        stress_level.value = '';
        happiness_level.value = '';
        time_spent.value = '';
        var last_entry_time = document.getElementById('last_entry_time');
        var today = new Date();
        last_entry_time.innerHTML = months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear() + " " + today.getHours() + ":" + (today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes());
        document.getElementById('submit_info').style.display = 'inline'
        setTimeout(function() { document.getElementById('submit_info').style.display = 'none'}, 4000);
    });

    table_radio.addEventListener('click', function() {
        graphModel.selectGraph(graph_table.id);
        customize_div.style.display = 'none';
    });

    bar_radio.addEventListener('click', function() {
        graphModel.selectGraph(graph_bar.id);
        customize_div.style.display = 'inline';
    });

    plot_btn.addEventListener('click', function() {
        plotbar(activityModel.getActivityDataPoints());
    });
});

/**
 * This function can live outside the window load event handler, because it is
 * only called in response to a button click event
 */
function runCanvasDemo() {
    /*
    Useful references:
     http://www.w3schools.com/html/html5_canvas.asp
     http://www.w3schools.com/tags/ref_canvas.asp
     */
    var canvas = document.getElementById('canvas_demo');
    var context = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    console.log("Painting on canvas at: " + new Date());
    console.log("Canvas size: " + width + "X" + height);

    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'red';
    context.moveTo(0, 0);
    context.lineTo(width, height);
    context.stroke();
}
