var body = d3.select("body");
// Invoked the select method, which selects an element in the DOM via CSS selector and appends a new element to it.
// body
//     .append("p")
//     .text("New Paragraph!");
// Specified the text property of the appended element

// When chaining methods, order matters. 
    // The output type of one must match the input of the next

var dataset = 
    [
        17,
        {
            word:"ham"
        },
        24,
        {
            array:[17,16]
        },
        "what's in the box",
        {
            location:"Edgware Road",
            line: "Bakerloo"
        },
        {
            housemate: "James"
        }
    ];

body
    .selectAll("p")
    // NB: without the selectAll .data cannot read the reference to the DOM and so the .append doesn't append to the body.
    .data(dataset)
    // .data counts and parses the data values
    .enter()
    // if more data is given to .enter than there are .selectAll elements in the DOM it creates extra place-holder elements.
    .append("p")
    // now .append can work with the reference to place-holder elements
        // .text("per value mapping");
        // Doing this has the effect of repeating the above per array element.
    .text(function(d){
        return d;
    })
    .style("color", function(d) {
        if (typeof d === "object"){
            return "#44CC09";
        } else {
            return "red";
        }
    });
    // when data is called it creates d which is only populated with the data when generated via function.
    // .text() .style() and .attr() can take a function as an argument


// When d3 binds data to an element that data doesn't exist in the DOM
    // it exists in memory as a __data__ attribute of that element

// body.selectAll("div")
    // .data(dataset)
    // .enter()
    // .append("div")
    // .attr("class", "bar")
    // .attr() can specify any html attribute
    // can also use .classed("class", true) which takes a class and true or false.
    // .style("height", function(d) {
    //     if (typeof d !== "number"){
    //         return "10px";
    //     } else {
    //         return (d * 2) + "px";
    //     }
    // });



var dataset2 = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
                14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
                24, 18, 25, 9, 3 ];
body.selectAll("div")
    .data(dataset2)
    .enter()
    .append("div")
    .classed("bar", true)
    .style("height", function(d) {
        return (d*5) + "px";
    });

var svg1 = body.append("svg");
var w = 600;
var h = 350;
svg1
    .attr("width", w)
    .attr("height", h);
var ellipses = svg1.selectAll("ellipse")
                .data(dataset2)
                .enter()
                .append("ellipse");

ellipses
    .attr("cx", function(d,i) {
    // here to style the circles we need to iterate between them as they are drawn.
    // d3 has i built in which automatically iterates for datapoints.
        return i * (w / dataset2.length) + 20;
    })
    .attr("cy", h/2)
    .attr("rx", function(d) {
        return d / 1.5;
    })
    .attr("ry", function(d) {
        return d * 5;
    })
    .attr("fill", function(d) {
        return "rgba(0,0," + (d * 8) + ",0.7)";
    });

    // .attr() can also be passed an object containing all f the declarations about
    // styling the element you want e.g:

    // .attr({
    //     cx: function(d,i) { return i * (w / dataset2.length) + 20; },
    //     cy: h/2,
    //     rx: function(d) { return d / 1.5 }
    //     etc
    // });

var svg2 = body.append("svg")
svg2.attr({
    width: w,
    height: h,
    fill: "black"
});
var barSpacing = 1
var bar = svg2
    .selectAll("rect")
    .data(dataset2)
    .enter()
    .append("rect");

bar
    .attr({
        x: function(d,i) { return i * (w/dataset2.length); },
        y: function(d) { return h-(d * 8) ; },
        width: function(d) { return (w/dataset2.length - barSpacing); },
        height: function(d) { return d * 8; },
        fill: function(d) { return "rgb(" + (d * 8) + ", 45, 25)";}
    });

// Adding labels to the bars of the graph

var labels = svg2
    .selectAll("text")
    .data(dataset2)
    .enter()
    .append("text")
    .text( function(d) {
        return d;
    });

labels
    .attr({
        x: function(d,i) { return i * (w/dataset2.length) + ((w/dataset2.length - barSpacing)/2); },
        y: function(d) { return h-(d * 8) + 14 ; },
        "font-family": "sans-serif",
        "font-size": "11px",
        fill: "white",
        "text-anchor": "middle"
    });
    

