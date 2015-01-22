'use strict';

// global variables
var energy_color = "#0000FF";
var stress_color = "#FF0000";
var happiness_color = "#00FF00";

// Table graph operations
function addToTable(activityDataPoint) {
    var table_body = document.getElementById('act_table_body');
    var row = document.createElement('tr');
    var column_activity = document.createElement('td');
    var column_time = document.createElement('td');
    column_activity.innerText = activityDataPoint.activityType;
    column_time.innerText = activityDataPoint.activityDurationInMinutes;
    row.appendChild(column_activity);
    row.appendChild(column_time);
    table_body.appendChild(row);
}

function changeTable(activityDataPoint) {
    var table_body = document.getElementById('act_table_body');
    var children = table_body.childNodes;

    for(var i=1; i<children.length; i++) {
        var row = children[i];
        var first_col = row.firstChild;

        if (first_col.innerText == activityDataPoint.activityType) {
            var last_col = row.lastChild;
            last_col.innerHTML = parseInt(last_col.innerHTML) + parseInt(activityDataPoint.activityDurationInMinutes);
            break;
        }
    }
}

function removeFromTable(activityDataPoint) {

}

// bar plot rendering

function addTobarPlot(activityDataPoint, activityDatas) {
    var canvas_bar = document.getElementById('canvas_bar');
    var width = canvas_bar.width;
    var rec_width = 20;
    var space = 25;
    var index = activityDatas.indexOf(activityDataPoint);
    var xcoord = 20 * (index+1) + index * 70;

    if (xcoord+3*rec_width+2*space > width) canvas_bar.width += 3 * rec_width + 2 * space;

    plotbar(activityDatas);

    var activity_names = document.getElementById('graph_activity_names');
    var spantext = document.createElement('span');
    spantext.innerHTML = activityDataPoint.activityType + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    //spantext.style.transform = "rotate(270deg)";
    activity_names.appendChild(spantext);
}

function plotbar(activityDatas) {
    var canvas_bar = document.getElementById('canvas_bar');
    var context = canvas_bar.getContext('2d');
    var energy_box = document.getElementById("energy_box");
    var stress_box = document.getElementById("stress_box");
    var happiness_box = document.getElementById("happiness_box");
    var width = canvas_bar.width;
    var height = canvas_bar.height;
    var space = 25;
    var xcoord, ycoord;
    var rec_width = 20;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0,0,width,height);

    for(var j=0; j<5; j++) {
        context.strokeStyle = 'cornflowerblue';
        context.moveTo(0, j * (height / 5)+10);
        context.lineTo(width, j * (height / 5)+10);
        context.stroke();
    }

    for(var i=0; i<activityDatas.length; i++) {
        var activityDataPoint = activityDatas[i];
        xcoord = (i+1) * 20 + i * 80;
        var energy = activityDataPoint.activityDataDict.energyLevel;
        var stress = activityDataPoint.activityDataDict.stressLevel;
        var happiness = activityDataPoint.activityDataDict.happinessLevel;

        if (energy_box.checked) {
            ycoord = (height - energy*(height/5))+10;
            context.fillStyle = energy_color;
            context.fillRect(xcoord, ycoord, rec_width, height - ycoord);
            xcoord += space;
        }

        if (stress_box.checked) {
            ycoord = (height - stress*(height/5))+10;
            context.fillStyle = stress_color;
            context.fillRect(xcoord, ycoord, rec_width, height - ycoord);
            xcoord += space;
        }

        if (happiness_box.checked) {
            ycoord = (height - happiness*(height/5))+10;
            context.fillStyle = happiness_color;
            context.fillRect(xcoord, ycoord, rec_width, height - ycoord);
        }
    }
}