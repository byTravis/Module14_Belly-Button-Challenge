
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";


//  Browse JSON data
d3.json(url).then(data => {
    console.log(data);
});


// Initial Launch - Chooses first option
function init() {
    let id_pulldown = d3.select("#selDataset"); 
        
    // Populates dropdown menu and uses the first name for the initial chart.
    d3.json(url).then(data => {       
        data.names.forEach(name =>{
            id_pulldown.append("option").text(name).property("value", name);
        })

        // Creates charts based on first option in pulldown
        pull_data(data.names[0])
    });
};


//  Pulls data and passes values to chart functions
function pull_data(subject_id) {
    d3.json(url).then(data => {
        let subject_samples = data.samples.filter(subject => subject.id == subject_id)[0];
        let metadata = data.metadata.filter(subject => subject.id == subject_id)[0];

        let sample_values = subject_samples.sample_values;        
        let otu_ids = subject_samples.otu_ids;        
        let otu_labels = subject_samples.otu_labels;
        let wash_frequency = metadata.wfreq;
  
        demographics(metadata);
        bar_chart(subject_id, sample_values, otu_ids, otu_labels); 
        gauge_chart(subject_id, sample_values, otu_ids, otu_labels, wash_frequency);
        bubble_chart(subject_id, sample_values, otu_ids, otu_labels);               
    });
};


// Generates Bar Chart
function bar_chart(subject_id, sample_values, otu_ids, otu_labels) {
    let trace = {
        x: sample_values.slice (0,10).reverse(),
        y: otu_ids.slice (0,10).reverse().map((item) => `OTU ` + item + " "),
        type: "bar",
        orientation: 'h', 
        text: otu_labels.slice (0,10).reverse(),
    };

    let trace_data = [trace]

    let layout = {
        title: "<b>Top 10 Bacteria Cultures Found</b>",
    };

    Plotly.newPlot("bar", trace_data, layout);
};


// Generates Bubble Chart
function bubble_chart(subject_id, sample_values, otu_ids, otu_labels) {
    let trace = {
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Portland',
        }, 
        text: otu_labels.reverse(),
    };

    let trace_data = [trace]

    let layout = {
        title: "<b>Bacteria Cultures Per Subject ID</b>",
        xaxis: {title: "OTU ID", titlefont: {size: 11, color: "#A0A0A0"}},
        yaxis: {title: "Sample Values", titlefont: {size: 11, color: "#A0A0A0"}},
    };

    Plotly.newPlot("bubble", trace_data, layout);
};


// Generates Gauge Chart
function gauge_chart(subject_id, sample_values, otu_ids, otu_labels, wash_frequency) {
    var trace = {
        value: wash_frequency,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [0, 10] },
            bar: { color: "#3b6064" },
            shape: "angular",
            steps: [
                {range: [0, 2], color: "#edeec9"},
                {range: [2, 4], color: "#dde7c7"},
                {range: [4, 6], color: "#bfd8bd"},
                {range: [6, 8], color: "#98c9a3"},
                {range: [8, 10], color: "#77bfa3"}
                ],
            },
    };
    
    trace_data = [trace]
    
    var layout = {        
        title: "<b>Belly Button Washing Frequency</b><br />Scrubs Per Week",   
    };

    Plotly.newPlot('gauge', trace_data, layout);  
};


// Generates demographics info card with metadata
function demographics(metadata) {
    let demographics_card = d3.select("#sample-metadata");

    demographics_card.html(`
	<ul style="list-style-type: none;, margin-left: 0px; padding-left: 0;">
        <li><strong>Subject ID:</strong>  ${metadata.id}</li>
        <li><strong>Ethnicity</strong>:  ${metadata.ethnicity}</li>
        <li><strong>Gender:</strong>  ${metadata.gender}</li>
        <li><strong>Age:</strong>  ${metadata.age}</li>
        <li><strong>Location:</strong>  ${metadata.location}</li>
        <li><strong>BBType:</strong>  ${metadata.bbtype}</li>
        <li><strong>WFreq:</strong>  ${metadata.wfreq}</li>
	</ul>
    `)
};


//  Updates charts and metadata when pulldown value has changed.
function optionChanged(subject_id) {
    pull_data(subject_id)
};


//  Starts the code
init();
