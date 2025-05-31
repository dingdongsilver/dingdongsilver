// Sample Data - Replace with actual data source for a real application
const formulaEData = [
    {
        seasonName: "Season 1 (2014-2015)",
        races: [
            {
                raceName: "Beijing ePrix",
                results: [
                    { driver: "Lucas di Grassi", team: "Audi Sport ABT", points: 25 },
                    { driver: "Franck Montagny", team: "Andretti", points: 18 },
                    { driver: "Sam Bird", team: "Virgin Racing", points: 15 },
                    { driver: "Nelson Piquet Jr.", team: "China Racing", points: 0 }, // Example DNF or no points
                    { driver: "Sébastien Buemi", team: "e.dams Renault", points: 10 },
                ]
            },
            {
                raceName: "Putrajaya ePrix",
                results: [
                    { driver: "Sam Bird", team: "Virgin Racing", points: 25 },
                    { driver: "Lucas di Grassi", team: "Audi Sport ABT", points: 18 },
                    { driver: "Sébastien Buemi", team: "e.dams Renault", points: 15 },
                    { driver: "Nelson Piquet Jr.", team: "China Racing", points: 12 },
                ]
            },
            {
                raceName: "Punta del Este ePrix",
                results: [
                    { driver: "Sébastien Buemi", team: "e.dams Renault", points: 25 },
                    { driver: "Nelson Piquet Jr.", team: "China Racing", points: 18 },
                    { driver: "Lucas di Grassi", team: "Audi Sport ABT", points: 15 },
                    { driver: "Sam Bird", team: "Virgin Racing", points: 8 },
                ]
            },
            {
                raceName: "Buenos Aires ePrix",
                results: [
                    { driver: "António Félix da Costa", team: "Amlin Aguri", points: 25},
                    { driver: "Nelson Piquet Jr.", team: "China Racing", points: 18 },
                    { driver: "Lucas di Grassi", team: "Audi Sport ABT", points: 15 },
                    { driver: "Sébastien Buemi", team: "e.dams Renault", points: 12 },
                    { driver: "Sam Bird", team: "Virgin Racing", points: 10 },
                ]
            }
            // ... more races for Season 1
        ],
        // List all unique drivers that participate in this season for graph consistency
        allDrivers: ["Lucas di Grassi", "Franck Montagny", "Sam Bird", "Nelson Piquet Jr.", "Sébastien Buemi", "António Félix da Costa"]
    },
    {
        seasonName: "Season 2 (2015-2016)",
        races: [
            {
                raceName: "Beijing ePrix",
                results: [
                    { driver: "Sébastien Buemi", team: "Renault e.dams", points: 25 },
                    { driver: "Lucas di Grassi", team: "ABT Schaeffler Audi Sport", points: 18 },
                    { driver: "Nick Heidfeld", team: "Mahindra Racing", points: 15 },
                    { driver: "Sam Bird", team: "DS Virgin Racing", points: 1 },
                ]
            },
            {
                raceName: "Putrajaya ePrix",
                results: [
                    { driver: "Lucas di Grassi", team: "ABT Schaeffler Audi Sport", points: 25 },
                    { driver: "Sam Bird", team: "DS Virgin Racing", points: 18 },
                    { driver: "Robin Frijns", team: "Andretti", points: 15 },
                    { driver: "Sébastien Buemi", team: "Renault e.dams", points: 12 },
                ]
            }
            // ... more races for Season 2
        ],
        allDrivers: ["Sébastien Buemi", "Lucas di Grassi", "Nick Heidfeld", "Sam Bird", "Robin Frijns"]
    }
    // ... more seasons
];