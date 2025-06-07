const seasonSelect = document.getElementById('season-select');
const raceSelect = document.getElementById('race-select');
const standingsTableBody = document.getElementById('driver-standings-table').getElementsByTagName('tbody')[0];
const pointsChartCanvas = document.getElementById('points-chart');
let pointsChart = null; // To store the Chart.js instance

// --- Initialization ---
function init() {
    populateSeasonDropdown();
    seasonSelect.addEventListener('change', handleSeasonChange);
    raceSelect.addEventListener('change', handleRaceChange);
}

function populateSeasonDropdown() {
    formulaEData.forEach((season, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = season.seasonName;
        seasonSelect.appendChild(option);
    });
}

function handleSeasonChange() {
    const seasonIndex = parseInt(seasonSelect.value);
    clearStandingsAndGraph();

    if (isNaN(seasonIndex)) {
        raceSelect.innerHTML = '<option value="">-- Select Season First --</option>';
        raceSelect.disabled = true;
        return;
    }

    populateRaceDropdown(seasonIndex);
    // Automatically select the first race
    if (raceSelect.options.length > 0) {
        raceSelect.value = "1"; 
        handleRaceChange();
    }
    
}

function populateRaceDropdown(seasonIndex) {
    const selectedSeason = formulaEData[seasonIndex];
    raceSelect.innerHTML = ''; // Clear previous options
    raceSelect.disabled = false;
    
    selectedSeason.races.forEach((race, index) => {
        const option = document.createElement('option');
        option.value = index+1; // Race index (1-based for display, matches num races processed)
        option.textContent = `Race ${index+1}: ${race.raceName}`;
        raceSelect.appendChild(option);
    });
    raceSelect.value = "1";
}

function handleRaceChange() {
    const seasonIndex = parseInt(seasonSelect.value);
    const raceUpToIndex = parseInt(raceSelect.value-1); // This is the number of races whose results to include

    if (isNaN(seasonIndex) || isNaN(raceUpToIndex)) {
        clearStandingsAndGraph();
        return;
    }
    updateDisplay(seasonIndex, raceUpToIndex);
}

function clearStandingsAndGraph() {
    standingsTableBody.innerHTML = '';
    if (pointsChart) {
        pointsChart.destroy();
        pointsChart = null;
    }
    // Clear canvas (optional, destroy usually handles it)
    const ctx = pointsChartCanvas.getContext('2d');
    ctx.clearRect(0, 0, pointsChartCanvas.width, pointsChartCanvas.height);
}


// --- Core Logic ---
function updateDisplay(seasonIndex, raceUpToIndex) {
    const season = formulaEData[seasonIndex];
    if (!season) return;

    // 1. Calculate Standings
    const driverPoints = {}; // { driverName: { points: X, team: Y } }
    const allDriversInSeason = new Set(season.allDrivers || []); // Use pre-defined list or build dynamically

    // Initialize all known drivers with 0 points
    season.allDrivers.forEach(driver => {
        driverPoints[driver] = { points: 0, team: "N/A" }; // Default team
    });
    
    // Accumulate points from races *before* the selected one
    // raceUpToIndex 1 means process results of race 0 (the first race)
    for (let i = 0; i < raceUpToIndex; i++) {
        if (season.races[i] && season.races[i].results) {
            season.races[i].results.forEach(result => {
                if (!driverPoints[result.driver]) {
                    driverPoints[result.driver] = { points: 0, team: result.team };
                    allDriversInSeason.add(result.driver); // Add if dynamically found
                }
                driverPoints[result.driver].points += result.points;
                driverPoints[result.driver].team = result.team; // Update with latest team
            });
        }
    }

    // Convert to array and sort
    const standingsArray = Object.entries(driverPoints).map(([name, data]) => ({
        name,
        points: data.points,
        team: data.team
    })).sort((a, b) => b.points - a.points);

    // 2. Display Standings
    standingsTableBody.innerHTML = ''; // Clear previous
    standingsArray.forEach((driver, index) => {
        const row = standingsTableBody.insertRow();
        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = driver.name;
        row.insertCell().textContent = driver.team;
        row.insertCell().textContent = driver.points;
    });

    // 3. Prepare and Display Graph
    updatePointsGraph(season, raceUpToIndex, Array.from(allDriversInSeason));
}


function updatePointsGraph(season, raceUpToIndex, seasonDrivers) {
    if (pointsChart) {
        pointsChart.destroy();
    }

    const labels = ["Start"]; // "Start" for 0 points initial state
    for (let i = 0; i < raceUpToIndex; i++) {
        labels.push(season.races[i] ? season.races[i].raceName.split(" ")[0] : `Race ${i+1}`); // Short name
    }
     if (raceUpToIndex === 0 && labels.length === 1 && labels[0] === "Start") {
        // No races processed yet, show a blank state or a single point at 0
        // To avoid Chart.js error with empty labels if raceUpToIndex is 0
    }


    const datasets = [];
    const driverColors = {}; // To assign consistent colors to drivers
    const availableColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#E7E9ED', '#80CC8A', '#DB004E', '#00AACC', '#F77F00', '#A200FF',
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
    ];
    let colorIndex = 0;

    seasonDrivers.forEach(driverName => {
        if (!driverColors[driverName]) {
            driverColors[driverName] = availableColors[colorIndex % availableColors.length];
            colorIndex++;
        }

        const driverData = {
            label: driverName,
            data: [0], // Start with 0 points
            borderColor: driverColors[driverName],
            backgroundColor: driverColors[driverName] + '33', // Semi-transparent fill
            fill: false,
            tension: 0.1
        };

        let currentPoints = 0;
        for (let i = 0; i < raceUpToIndex; i++) {
            const race = season.races[i];
            if (race && race.results) {
                const raceResultForDriver = race.results.find(r => r.driver === driverName);
                if (raceResultForDriver) {
                    currentPoints += raceResultForDriver.points;
                }
            }
            driverData.data.push(currentPoints);
        }
        datasets.push(driverData);
    });
    
    // Ensure labels are not empty if raceUpToIndex is 0
    const chartLabels = labels.length > 0 ? labels : ["Start"];
    const chartDatasets = datasets.length > 0 ? datasets : [{ label: 'No Data', data: [0], borderColor: '#ccc', fill: false }];


    const ctx = pointsChartCanvas.getContext('2d');
    pointsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: chartDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Points Progression - ${season.seasonName}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Points'
                    }
                },
                x: {
                     title: {
                        display: true,
                        text: 'Races Processed'
                    }
                }
            }
        }
    });
}

// --- Start the application ---
init();