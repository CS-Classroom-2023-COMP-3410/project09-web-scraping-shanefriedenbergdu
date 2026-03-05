const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');

async function scrapeCalendar() {
    console.log('Scraping DU Calendar...');
    const response = await axios.get('https://www.du.edu/calendar');
    const $ = cheerio.load(response.data);

    const events = [];

    $('a.event-card').each((index, item) => {
        var title = $(item).find('h3').text().trim();
        // First <p> is the date, second <p> has the time
        var paragraphs = $(item).find('p');
        var date = $(paragraphs[0]).text().trim();
        var time = '';

        // Look for the paragraph with the clock icon for time
        paragraphs.each((i, p) => {
            if ($(p).find('.icon-du-clock').length > 0) {
                time = $(p).text().trim();
            }
        });

        if (title) {
            var event = { title: title, date: date };
            if (time) event.time = time;
            events.push(event);
        }
    });

    fs.ensureDirSync('results');
    fs.writeFileSync('results/calendar_events.json', JSON.stringify({ events }, null, 4));
    console.log(`Saved ${events.length} events to results/calendar_events.json`);
}

scrapeCalendar().catch(console.error);