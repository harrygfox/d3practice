// Blobs of totals
var xProportion = 20;
var yProportion = 30;

var sessions = {
    total: 0,
    name: "Total Sessions"
}
var claim = {
    total: 0,
    name: "Reward Claims"
}
var noClaim = {
    total: 0,
    name: "Unclaimed Rewards"
}
var social = {
    total: 0,
    name: "Social Shares"
}
var noShare = {
    total: 0,
    name: "Unshared Sessions"
}
var dropOff = {
    total: 0,
    name: "Drop Off"
}

var blobsWrapper = d3.select("body")
        .append("svg")
        .classed("blobs-wrapper", true)
        .attr({
            height: 400,
            width: 1000
        });

var dataset = d3.csv("sessions-less-shares.csv",
    function(error, csv_file) {

        // NEST DATA ACCORDING TO DATE
        data = d3.nest()
                .key(function(d) {
                    return d.date;
                })
                .entries(csv_file);

        // ADD VALUES TO GLOABAL VARIABLES
        calculateTotals(data);

        // DRAW THE VARIABLES AS BLOBS
        drawBlobs(data);

        // Total Sessions
        console.log("---------------------------------");
        console.log("Total sessions = " + sessions.total);

        // Total reward Claims
        console.log("---------------------------------");
        console.log("Total reward claim = " + claim.total);
        console.log("Did NOT claim = " + noClaim.total);
        
        // Total social shares
        console.log("---------------------------------");
        console.log("Total social shares = " + social.total);
        console.log("NO social share = " + noShare.total);

        // Total drop off
        console.log("---------------------------------");
        console.log("Total drop = " + dropOff.total);


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

function drawBlobs(data) {
    confirm("are you ready for the blobs?");

    var sessionsBlob =
        blobsWrapper
            .append("rect")
            .attr({
                height: (sessions.total/yProportion),
                width: (sessions.total/xProportion),
                fill: "red"
            });

    var claimsBlob =
        blobsWrapper
            .append("rect")
            .attr({
                height: (claim.total/yProportion),
                width: (claim.total/xProportion),
                fill: "blue",
                x: (sessions.total/xProportion) + 30
            });
    addBlobName(sessions);
    addBlobName(claim);
}

function addBlobName(object) {
    blobsWrapper
        .append("text")
        .text(object.name)
        .attr({
            x: function() {
                if(object === sessions) {
                    console.log("hello");
                } else {
                    return (object.total/yProportion)/2;
                }
            },
            y: (object.total/xProportion)/2,
            fill: "white"
        });

}
        





