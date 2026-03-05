const axios = require('axios');
const fs = require('fs-extra');

async function scrapeAthletics() {
    console.log('Scraping DU Athletics...');
    const response = await axios.get('https://denverpioneers.com/services/adaptive_components.ashx', {
        params: { type: 'scoreboard', start: 0, count: 20, sport_id: 0 }
    });

    const games = response.data
    const events = [];

    games.forEach(game => {
        events.push({
            duTeam: game.sport.short_title,
            opponent: game.opponent.title,
            date: game.date
        });
    });

    fs.ensureDirSync('results');
    fs.writeFileSync('results/athletic_events.json', JSON.stringify({ events }, null, 4));
    console.log(`Saved ${events.length} events to results/athletic_events.json`);
}

scrapeAthletics().catch(console.error);