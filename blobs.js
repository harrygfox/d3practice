// Blobs of totals
var xProportion = 0.08,
    yProportion = 0.025,
    h = 1000,
    w = 1200,
    padding = 20,
    yPos = 0,
    xPos = 0;

// TOTAL SESSIONS
var sessions = {
    total: 0,
    name: "Total Sessions"
}
//  TOTAL REWARD CLAIMS
var claim = {
    total: 0,
    name: "Reward Claims"
}
var noClaim = {
    total: 0,
    name: "Unclaimed Rewards"
}
// TOTAL SOCIAL SHARES
var social = {
    total: 0,
    name: "Social Shares"
}
var noShare = {
    total: 0,
    name: "Unshared Sessions"
}
// TOTAL DROPOFF
var dropOff = {
    total: 0,
    name: "Drop Off"
}

var blobsWrapper = d3.select("body")
        .append("svg")
        .classed("blobs-wrapper", true)
        .attr({
            height: h,
            width: w
        });

var dataset = d3.csv("sessions-less-shares.csv",
    function(error, csv_file) {

        // NEST DATA ACCORDING TO DATE
        data = d3.nest()
                .key(function(d) {
                    return d.date;
                })
                .entries(csv_file);

        // ADD VALUES TO GLOBAL VARIABLES
        calculateTotals(data);
        

        // DRAW THE VARIABLES AS BLOBS
        drawBlob(sessions);
        drawBlob(claim);
        drawBlob(social);
        drawBlob(dropOff);
    }
);

function calculateTotals(data) {
    // CALCULATE TOTALS
    for (var i = 0; i < data.length; i++) {
        sessions.total += data[i].values.length;
        for (var j = 0; j < data[i].values.length; j++) {

            // Calculate Reward Claims
            switch(data[i].values[j].claimed) {
                case "yes":
                    claim.total++;
                    break;
                case "no":
                    noClaim.total++;
                    break;
                default:
                    console.log("There is no entry for this data value");
            };

            // Calculate social shares
            if((data[i].values[j].social) === "") {
                noShare.total++;
            }
            social.total = sessions.total - noShare.total;

            // Calculate dropoff
            if( (data[i].values[j].social === "") && (data[i].values[j].claimed === "no") ) {
                dropOff.total++;
            }
        };
    };
}

function drawBlob(object) {
    
    if(object == sessions) {
        xPos = padding;
    } else {
        xPos = (sessions.total * xProportion) + (padding * 2);
    }

    switch(object) {
        case social:
            yPos = (claim.total * yProportion) + (padding * 2);
            break;
        case dropOff:
            yPos = (claim.total * yProportion) + (social.total * yProportion) + (padding * 3);
            break;
        default:
            yPos = padding * 2;
            break;
    }

    var blobAttr = {
        height: object.total * yProportion,
        width: object.total * xProportion,
        x: xPos,
        y: yPos
    }

    blobsWrapper
        .append("path")
        .attr("d", 
            roundedRect(
                blobAttr.x,
                blobAttr.y,
                blobAttr.width,
                blobAttr.height,
                5) 
            )
        .attr({
            fill: "#ccc",
            stroke: "#000",
            class: object.name
        });

    addBlobName(object);
    
}

function addBlobName(object) {
    blobsWrapper
        .append("text")
        .text(object.name)
        .attr({
            x: function() {
                if(object == sessions) {
                    return padding * 2;
                } else {
                    return (sessions.total * xProportion) + (padding * 3);
                }
            },
            y: function() {
                switch(object) {
                    case social:
                        return (claim.total * yProportion) + (padding * 3);
                        break;
                    case dropOff:
                        return (claim.total * yProportion) + (social.total * yProportion) + (padding * 4);
                        break;
                    default:
                        return padding * 3;
                        break;
                }
            },
            fill: "#333",
            "font-family": "sans-serif",
            "font-size": "15px",
            "text-anchor": "right"
        });
}

// FUNCTION FOR DRAWING THE PATHS
// The top-left corner is ⟨x,y⟩.
function roundedRect(x, y, width, height, radius) {
  return "M" + (x + radius) + "," + y
       + "h" + (width - 2 * radius)
       + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
       + "v" + (height - 2 * radius)
       + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
       + "h" + (- width + 2 * radius)
       + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
       + "v" + (- height + 2 * radius)
       + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
       + "z";
}


