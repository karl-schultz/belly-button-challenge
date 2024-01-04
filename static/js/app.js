// create function "init" to create initial static webpage to display data
function init() {
  // create variable for web dropdown to select sample data from json file
  let dropdown = d3.select("#selDataset");

  // Use D3 library to read in "samples.json" file from URL
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  // Create variable to hold name data from each sample 
  let sampleNames = data.names;

    // create for loop to run through each sample and store data for each
    for (let i = 0; i < sampleNames.length; i++){
      dropdown
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    };

    // create variable to hold data just for the first sample looped through to display on web page when first loaded
    let firstSample = sampleNames[0];
    plotsCreate(firstSample);
    demoInfo(firstSample);
  });
}

// create function "plotsCreate" to build and populate with data plots for web page
function plotsCreate(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // variable to get data from "samples" key from json file
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // variable to get data from "otu_ids" key from json file
    let otuIds = result.otu_ids;
    // variable to get data from "otu_labels" key from json file
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    // create a HORIZONTAL BAR CHART with a dropdown menu to display top 10 OTUs found in each individual
    // create variable to get data for yticks
    let yTicks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    // create variable to get data for bar chart from json file, slicing data for top 10 OTU values
    let barPlotData = [
      {
        y: yTicks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    // create variable to set margins and title for bar chart
    let barPlotLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // use Plotly javascript library to plot bar chart from sample data
    Plotly.newPlot("bar", barPlotData, barPlotLayout);

    // create a BUBBLE CHART that displays each sample
    // create variable to set margins, hovermode, main title, and x axis title for bubble chart
    let bubblePlotLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    let bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
        }
      }
    ];

    // use Plotly javascript library to plot bubble chart from sample data
    Plotly.newPlot("bubble", bubbleData, bubblePlotLayout);

  });
}

// create function to display the sample metadata in popups when charts are hovered over
function displayInfo(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // variable to get data from "metadata" key in json file
    let metadata = data.metadata;
    
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    
    let PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    for (key in result){
      PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    };

  });
}

// create funtion so that display data is updated when users select new subject Id in dropdown menu
function optionChanged(newSample) {
  plotsCreate(newSample);
  displayInfo(newSample);
}

// call "init" function to display interactive belly button biodiversity data on web page
init();
