
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";


d3.json(url).then(data => {
    console.log(data);
});




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

function pull_data(subject_id) {
    d3.json(url).then(data => {
        let subject_samples = data.samples.filter(subject => subject.id == subject_id)[0];

        let sample_values = subject_samples.sample_values;        
        let otu_ids = subject_samples.otu_ids;        
        let otu_labels = subject_samples.otu_labels;

        let metadata = data.metadata.filter(subject => subject.id == subject_id)[0];    

        demographics(metadata);
        bar_chart(subject_id, sample_values, otu_ids, otu_labels); 
        bubble_chart(subject_id, sample_values, otu_ids, otu_labels);               
    });
};

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
        title: `Subject ID: ${subject_id}`,
    };

    Plotly.newPlot("bar", trace_data, layout);
};



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
        title: `Subject ID: ${subject_id}`,
    };

    Plotly.newPlot("bubble", trace_data, layout);


};


function demographics(metadata) {
    let demographics_card = d3.select("#sample-metadata");

    demographics_card.html(`
	<ul style="list-style-type: none;, margin-left: 0px; padding-left: 0;">
        <li><strong>Subject ID:</strong> ${metadata.id}</li>
        <li><strong>Ethnicity</strong>: ${metadata.ethnicity}</li>
        <li><strong>Gender:</strong> ${metadata.gender}</li>
        <li><strong>Age:</strong> ${metadata.age}</li>
        <li><strong>Location:</strong> ${metadata.location}</li>
        <li><strong>BBType:</strong> ${metadata.bbtype}</li>
        <li><strong>WFreq:</strong> ${metadata.wfreq}</li>
	</ul>
    `)
};





function optionChanged(subject_id) {
    console.log("updated", subject_id);
    pull_data(subject_id)
};


init();
