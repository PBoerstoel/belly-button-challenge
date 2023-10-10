let samplesurl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function stringy(obj) { 
  return JSON.stringify(obj).replace("}","").replace("{","").replaceAll('"','').replaceAll(",", "\n" );
}
d3.json(samplesurl).then(function(data) {
    d3.select("#selDataset").selectAll("myOptions").data(data.names).enter().append("option").text(function (d) { return d; }).attr("value", function (d) { return d; })
    //I adapted this from code found here: https://d3-graph-gallery.com/graph/line_select.html
    //used to create drop down menu options
    let svalues = data.samples[0].sample_values
    let sotu_ids = data.samples[0].otu_ids.map(function(s){return "OTU " + s.toString()})
    let slabels=data.samples[0].otu_labels
    let databar = [{
      x: svalues.slice(0,9),
      y: sotu_ids.slice(0,9),
      text: slabels.slice(0,9),
      type: "bar",
      orientation: 'h'
    }];
  //all the data was pre-sorted
    let layoutbar = {
      yaxis:{autorange:"reversed"},
      xaxis:{title:"Sample Values"},
      height: 700,
      width: 1000
    };
    
    let databubble = [{
      x: data.samples[0].otu_ids, //only did x this way because that's how the example in the assignment page had it
      y:svalues,
      mode: "markers",
      marker: {size: svalues, color: data.samples[0].otu_ids},
      text: slabels,
    }];
    
    let layoutbubble = {
      height: 600,
      width: 1400,
      xaxis:{title:"OTU IDS"}
    };

    Plotly.newPlot("bar", databar,layoutbar);
    Plotly.newPlot("bubble",databubble,layoutbubble);

    let metadata = data.metadata;
    d3.select("#sample-metadata").text(stringy((metadata[0])));
  });

function optionChanged(val) {
  d3.json(samplesurl).then(function(data) {
    

    // Initialize x and y arrays
    let svals = [];
    let soids = [];
    let stexts = [];
    for (let i=0; i < data.names.length; i++) {
      if (val == data.samples[i].id) {
        newmeta = data.metadata[i];
        svals = data.samples[i].sample_values;
        soids= data.samples[i].otu_ids;
        stexts = data.samples[i].otu_labels;
      }
    }
    
    Plotly.restyle("bar", "x", [svals.slice(0,9)]);
    Plotly.restyle("bar", "y", [soids.slice(0,9).map(function(s){return "OTU " + s.toString()})]);
    Plotly.restyle("bar", "text", [stexts.slice(0,9)]);


    Plotly.restyle("bubble","x",[soids]);
    Plotly.restyle("bubble","y",[svals]);
    Plotly.restyle("bubble","text",[stexts]);
    Plotly.restyle("bubble","marker",[{size:svals,color:soids}]);

    d3.select("#sample-metadata").text(stringy((newmeta)));
  });
};
