const selenium = require('./selenium-functions').fn;
const fs = require('fs');
var pathToFileKeepingLastCheckedProfile = "lcp.txt";

var searchMechanism;
var scraper;

// CONFIG
const loadFromFile = 'file';
const inSiteSearching = 'criteria';

const searchMechanismType = inSiteSearching;
var username = "";
var password = "";
var scrapedProfiles = 0; // Update that before each start. 
var profilesNeeded = 100;
var loginUrl = 'https://www.linkedin.com/login?trk=guest_homepage-basic_nav-header-signin';

async function prepareLinkedIn() {
    loadSearchMechanism();
    loadScraper();
    await openBrowserAndLoadLinkedIn();
    await logIn();
    return lastCheckedProfile();
}

function loadSearchMechanism() {
    if (searchMechanismType == loadFromFile) {
        searchMechanism = require('./linkedin-search-from-file').load(selenium);
    } else if (searchMechanismType == inSiteSearching) {
        searchMechanism = require('./linkedin-search-by-criteria').load(selenium);
    }
}

function loadScraper() {
    scraper = require('./linkedin-scraper').load(selenium);
}

async function openBrowserAndLoadLinkedIn() {
    await selenium.navigate(loginUrl);
    await selenium.sleep(3000);
    await selenium.maximize();
    await selenium.sleep(2000);
}

async function logIn() {
    var inputElement = await selenium.findById("username");
    await inputElement.clear();
    await inputElement.sendKeys(username);

    await selenium.sleep(1000)

    var pass = await selenium.findById("password");
    await pass.clear();
    await pass.sendKeys(password);

    await selenium.sleep(1000)

    var loginBtn = await selenium.findByClassSingle("btn__primary--large");
    return loginBtn.click();
}

function lastCheckedProfile() {
    try {
        var lcp = fs.readFileSync(pathToFileKeepingLastCheckedProfile);
        return parseInt(lcp);
    } catch {
        return 1;
    }
}

(async () => {
    var lastCheckedProfile = await prepareLinkedIn();

    for (let i = lastCheckedProfile; scrapedProfiles <= profilesNeeded; i++) {
        try {
            await searchMechanism.openProfile(i);
            await selenium.sleep(2000);
            await scraper.goThroughProfile();
        } catch {
            // don't do anything
        } finally {
            fs.writeFileSync(pathToFileKeepingLastCheckedProfile, i);
        }
    }
})();