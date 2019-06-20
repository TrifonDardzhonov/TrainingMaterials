var selenium;

// temp
var searchResultsUrl = '';

// CONFIG
var criteria = "marketing";

// xpath
var searchInputXpath = '//input[@placeholder="Search"]';
var personFilterXpath = '//span[contains(@class, "artdeco-button__text") and text()="People"]';
var personLinkXpath = '//span[contains(@class, "actor-name")]';
var profilesPerPage = 10;

exports.load = function (s) {
    selenium = s;

    return {
        openProfile: async function (personNumber) {
            await loadSearchResults(criteria, personNumber);
            await open(personNumber);
        }
    }
}

async function loadSearchResults(criteria, personNumber) {
    await selenium.sleep(2000);
    var pageNumber = findPageNumber(personNumber);

    if (searchResultsUrl && searchResultsUrl.length) {
        await loadSearchPage(pageNumber);
    } else {
        await searchAndStoreSearchUrl(criteria);
        if (pageNumber > 1) {
            await loadSearchPage(pageNumber);
        }
    }

    await selenium.sleep(2000);
    await clickOnPersonButton();
    await selenium.scrollDown();
}

async function open(personNumber) {
    console.log("OPEN PROFILE NUMBER " + personNumber);
    var personInPage = personNumber % profilesPerPage;
    persons = await selenium.findByXPath(personLinkXpath);
    await selenium.scrollToElement(persons[personInPage]);
    persons[personInPage].click();
}

async function searchAndStoreSearchUrl(criteria) {
    await enterTheCriteriaIntoTheSearch(criteria);
    searchResultsUrl = await selenium.currentUrl();
}

async function enterTheCriteriaIntoTheSearch() {
    var searchInput;
    // this is because sometimes it shows an error and the search bar is missing
    try {
        searchInput = await selenium.findByXPathSingle(searchInputXpath);
    } catch {
        await selenium.navigate(selenium.currentUrl());
        await selenium.sleep(4000);
        searchInput = selenium.findByXPathSingle(searchInputXpath);
    }
    await searchInput.clear();
    await searchInput.sendKeys(criteria + selenium.enterKey());
    await selenium.sleep(3000);
}

async function clickOnPersonButton() {
    await selenium.clickOn(personFilterXpath);
    await selenium.sleep(3000);
}

function findPageNumber(personNumber) {
    var isFirstPage = (personNumber / profilesPerPage) < 1;
    return isFirstPage ? 1 : Math.ceil(personNumber / profilesPerPage);
}

async function loadSearchPage(pageNumber) {
    if (pageNumber > 1) {
        await selenium.navigate(searchResultsUrl + "&page=" + pageNumber);
    } else {
        await selenium.navigate(searchResultsUrl);
    }

    await selenium.sleep(2000);
}