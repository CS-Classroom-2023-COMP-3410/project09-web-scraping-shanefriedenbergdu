const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');

async function scrapeBulletin() {
    console.log('Scraping DU Bulletin...');
    const response = await axios.get('https://bulletin.du.edu/undergraduate/majorsminorscoursedescriptions/traditionalbachelorsprogrammajorandminors/computerscience/#coursedescriptionstext');
    const $ = cheerio.load(response.data);

    const courses = [];

    $('.courseblock').each((index, block) => {
       var titleText = $(block).find('.courseblocktitle').text().replace(/\u00a0/g, ' ').trim();
        var descText = $(block).find('.courseblockdesc').text().trim();
        if (!titleText.startsWith('COMP ')) return;
        var parts = titleText.split(' ');
        var courseCode = parts[1];
        var courseNum = parseInt(courseCode);

        if (courseNum < 3000) return;

        if (descText.toLowerCase().includes('prerequisite')) return;

        var afterCode = titleText.substring(titleText.indexOf(courseCode) + courseCode.length).trim();
        var creditsIndex = afterCode.lastIndexOf('(');
        var title = creditsIndex !== -1 ? afterCode.substring(0, creditsIndex).trim() : afterCode;

        courses.push({
            course: 'COMP-' + courseCode,
            title: title
        });
    });

    fs.ensureDirSync('results');
    fs.writeFileSync('results/bulletin.json', JSON.stringify({ courses }, null, 4));
    console.log(`Saved ${courses.length} courses to results/bulletin.json`);
}

scrapeBulletin().catch(console.error);