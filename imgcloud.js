// Fetch the CSV data from the Google Sheets public URL
const csvURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAslS0qJIW9-gCKphREIL6wo4x8aTSgvLD9P8LxRlwKZjM9qW3rsCrk1H294Bb1lebyz1Y6xDLxGO_/pub?gid=468759111&single=true&output=csv';

fetch(csvURL)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n');
        const headers = rows[0].split(',');
        const values = rows.slice(1).map(row => row.split(','));

        // Create an object to store the frequency counts
        const frequencyMap = {};

        // Count the frequency of each number in column C
        values.forEach(columns => {
            const number = parseInt(columns[2]);
            if (frequencyMap[number]) {
                frequencyMap[number]++;
            } else {
                frequencyMap[number] = 1;
            }
        });

        // Create an array of image objects with frequencies
        const images = Object.keys(frequencyMap).map(number => {
            const frequency = frequencyMap[number];
            return {
                url: `wordcloudimages/${number}.jpg`,
                frequency: frequency
            };
        });

        // Create the word cloud using the image frequencies
        createWordCloud(images);
    })
    .catch(error => {
        console.log('Error fetching data:', error);
    });

// Function to create the image word cloud
function createWordCloud(images) {
    const width = 800;
    const height = 500;

    const svg = d3.select('#word-cloud')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const wordGroup = svg.selectAll('.word')
        .data(images)
        .enter()
        .append('g')
        .attr('class', 'word')
        .attr('transform', () => `translate(${Math.random() * width},${Math.random() * height})`);

    const sizeScale = d3.scaleLinear()
        .domain([d3.min(images, d => d.frequency), d3.max(images, d => d.frequency)])
        .range([50, 150]);

    wordGroup.append('image')
        .attr('xlink:href', d => d.url)
        .attr('width', d => sizeScale(d.frequency))
        .attr('height', d => sizeScale(d.frequency));
}