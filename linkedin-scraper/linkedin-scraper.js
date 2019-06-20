const fs = require('fs');
var csv = require('fast-csv');

var pathToResultFile = 'db' + (+new Date) + '.csv';

var csvStream = csv.format({
    headers: true
});
writableStream = fs.createWriteStream(pathToResultFile);
csvStream.pipe(writableStream);

var selenium;

// twitter acc
var seeContantInfoXpath = '//a[@data-control-name="contact_see_more"]'
var twitterSectionXpath = '//li-icon[contains(@class, "pv-contact-info__contact-icon") and @type="twitter-icon"]';
var twitterAccountXpath = '//section[contains(@class, "ci-twitter")]//li';
var closeDialogXpath = '//button[@aria-label="Dismiss"]';
// basic profile info
var usernameXpath = '//li[contains(@class, "inline t-24 t-black t-normal break-words")]';
var headlineXPath = '//h2[contains(@class, "mt1 t-18 t-black t-normal")]';
var summaryXpath = '//span[contains(@class, "lt-line-clamp__raw-line")]';
var jobDescriptionXpath = '//p[contains(@class, "pv-entity__description")]';
// projects
var projectsExpandXpath = '//button[contains(@class, "pv-accomplishments-block__expand") and @aria-label="Expand projects section"]';
var projectsCollapseXpath = '//button[contains(@class, "pv-accomplishments-block__expand") and @aria-label="Collapse projects section"]';
var projectTitleXpath = '//h4[contains(@class, "pv-accomplishment-entity__title")]';
var projectDescriptionXpath = '//p[contains(@class, "pv-accomplishment-entity__description")]';
// publications
var publicationsExpandXpath = '//button[contains(@class, "pv-accomplishments-block__expand") and @aria-label="Expand publications section"]';
var publicationsCollapseXpath = '//button[contains(@class, "pv-accomplishments-block__expand") and @aria-label="Collapse publications section"]';
var publicationTitleXpath = '//h4[contains(@class, "pv-accomplishment-entity__title")]';
var publicationDescriptionXpath = '//p[contains(@class, "pv-accomplishment-entity__description")]';
// activities section
var allActivitiesLinkXpath = '//a[contains(@class, "pv-profile-section__see-more-inline pv-profile-section__text-truncate-toggle") and @data-control-name="recent_activity_details_all"]';
// articles
var articlesFilterXpath = '//button[contains(@class, "pv-recent-activity-detail__pill") and @aria-label="Articles"]';
var articleContainerXpath = '//div[contains(@class, "pv-recent-activity-detail__outlet-container")]';
var linkToArticleXpath = '//div[contains(@class, "pv-recent-activity-detail__outlet-container")][{0}]//a[contains(@class, "pv-post-entity__outer-wrapper-permalink")]';
var articleContentXpath = '//div[contains(@class, "reader-article-content")]//p';
var returnToArticlesLinkXpath = '//a[contains(@class, "reader-author-info__total-articles")]';
// posts
var postsFilterXpath = '//button[contains(@class, "pv-recent-activity-detail__pill") and @aria-label="Posts"]';
var postContainerXpath = '//div[contains(@id, "voyager-feed")]/div[contains(@class, "feed-shared-update-v2")]';
var postSeeMoreBtnXpath = '//div[contains(@id, "voyager-feed")]/div[contains(@class, "feed-shared-update-v2")][{0}]//button[@data-control-name="commentary_expand"]';
var postContentXpath = '//div[contains(@id, "voyager-feed")]/div[contains(@class, "feed-shared-update-v2")][{0}]//div[contains(@class, "feed-shared-text__text-view")]';

exports.load = function (s) {
    selenium = s;

    return {
        goThroughProfile: async function () {
            var twitterAccounts = await linkedTwitterAccounts();
            if (twitterAccounts.length) {
                console.log("SCRAP PROFILE WITH TWITTER ACCOUNTS: " + twitterAccounts.join());
                await scrapProfile(twitterAccounts)
                scrapedProfiles++;
            }
        }
    }
}

async function linkedTwitterAccounts() {
    var twitterAccounts = [];
    var twitterAccount = '';
    var contactInfoLink = await selenium.findByXPathSingle(seeContantInfoXpath);

    await contactInfoLink.click();
    await selenium.sleep(1000);

    try {
        var twitterSection = await selenium.findByXPathSingle(twitterSectionXpath);
        if (twitterSection) {
            var twitterAccountElements = await selenium.findByXPath(twitterAccountXpath);
            for (let i = 0; i < twitterAccountElements.length; i++) {
                twitterAccount = await twitterAccountElements[i].getText();
                twitterAccounts.push(twitterAccount);
            }
        }
    } catch { }

    await selenium.clickOn(closeDialogXpath);
    await selenium.sleep(1000);
    return twitterAccounts;
}

async function scrapProfile(twitterAccounts) {
    var username = await scrapUsername();
    var headline = await scrapHeadline();
    var summary = await scrapSummary();
    var jobDescriptions = await scrapJobDescriptions();
    await selenium.scrollDown();
    var projects = await scrapAccomplishments(projectsExpandXpath, projectTitleXpath, projectDescriptionXpath, projectsCollapseXpath);
    var publications = await scrapAccomplishments(publicationsExpandXpath, publicationTitleXpath, publicationDescriptionXpath, publicationsCollapseXpath);
    var activities = await scrapActivities();

    if (activities.articles.length || activities.posts.length) {
        await saveScrappedProfile({
            username: username,
            headline: headline,
            summary: summary,
            jobDescriptions: jobDescriptions,
            projects: projects,
            publications: publications,
            articles: activities.articles,
            posts: activities.posts,
            twitterAccounts: twitterAccounts
        });
    }
}

async function saveScrappedProfile(profile) {
    csvStream.write({
        username: profile.username,
        headline: profile.headline,
        summary: profile.summary,
        jobDescriptions: profile.jobDescriptions.join(),
        projects: profile.projects.map(p => p.title + " : " + p.description).join(),
        publications: profile.publications.map(p => p.title + " : " + p.description).join(),
        articles: profile.articles.map(a => a.title + " : " + a.content).join(),
        posts: profile.posts.map(p => p.content).join(),
        twitterAccounts: profile.twitterAccounts.join()
    }, { headers: true });
}

async function scrapUsername() {
    var usernameElement = await selenium.findByXPathSingle(usernameXpath);
    return await usernameElement.getText();
}

async function scrapHeadline() {
    var headlineElement = await selenium.findByXPathSingle(headlineXPath);
    return await headlineElement.getText();
}

async function scrapSummary() {
    var summaryElements = await selenium.findByXPath(summaryXpath);
    if (summaryElements.length) {
        return await summaryElements[0].getText();
    } else {
        return '';
    }
}

async function scrapJobDescriptions() {
    var descriptions = [];
    var text;
    var jobs = await selenium.findByXPath(jobDescriptionXpath);

    for (let i = 0; i < jobs.length; i++) {
        text = await jobs[i].getText();
        descriptions.push(text);
    }

    return descriptions;
}

async function scrapAccomplishments(expandXpath, titleXpath, descriptionXpath, collapseXpath) {
    var accomplishments = [];
    var expanded = false;

    try {
        expanded = await selenium.clickOn(expandXpath);
    } catch {
        return accomplishments;
    }

    if (expanded) {
        await selenium.sleep(3000);
        accomplishments = await scrapEnteredAccomplishments(titleXpath, descriptionXpath);
        await selenium.clickOn(collapseXpath);
    }

    return accomplishments;
}

async function scrapEnteredAccomplishments(titleXpath, descriptionXpath) {
    var accomplishments = [];
    var accomplishmentTitle;
    var accomplishmentDescription;

    var accomplishmentTitles = await selenium.findByXPath(titleXpath);
    var accomplishmentDescriptions = [];

    try {
        accomplishmentDescriptions = await selenium.findByXPath(descriptionXpath);
    } catch { }

    for (let i = 0; i < accomplishmentTitles.length; i++) {
        accomplishmentTitle = await accomplishmentTitles[i].getText();

        if (accomplishmentDescriptions.length && await accomplishmentDescriptions[i]) {
            accomplishmentDescription = await accomplishmentDescriptions[i].getText();
        } else {
            accomplishmentDescription = '';
        }

        accomplishments.push({
            title: accomplishmentTitle,
            description: accomplishmentDescription
        })
    }

    return accomplishments;
}

async function scrapActivities() {
    await selenium.scrollTillTheBeginning();
    var activitiesAreOpened = await selenium.clickOn(allActivitiesLinkXpath);

    var articles = [];
    var posts = [];

    if (activitiesAreOpened) {
        await selenium.sleep(2000);
        articles = await scrapArticles();
        await selenium.sleep(2000);
        posts = await scrapPosts();
    }

    return {
        articles: articles,
        posts: posts
    };
}

async function scrapArticles() {
    var articles = [];
    var article;
    var articlesAreReady = await selenium.clickOn(articlesFilterXpath);

    if (articlesAreReady) {
        await selenium.sleep(2000);
        await selenium.scrollDown();
        var articleElements = await selenium.findByXPath(articleContainerXpath);

        if (articleElements && articleElements.length) {
            for (let i = 0; i < articleElements.length; i++) {
                article = await scrapArticle(i + 1);
                articles.push(article);
                await selenium.clickOn(returnToArticlesLinkXpath);
                await selenium.sleep(3000);
            }
        }
    }

    return articles;
}

async function scrapArticle(i) {
    var title = '';
    var text = '';

    try {
        var articleTitle = await selenium.findByXPathSingle(linkToArticleXpath.replace("{0}", i));
        title = await articleTitle.getText();
        await articleTitle.click();
        await selenium.sleep(2000);

        var content = await selenium.findByXPath(articleContentXpath);
        await selenium.sleep(2000);

        for (let i = 0; i < content.length; i++) {
            text += await content[i].getText();
        }
    } catch { }

    return {
        title: title,
        content: text
    }
}

async function scrapPosts() {
    var posts = [];
    var post;
    var postsAreReady = await selenium.clickOn(postsFilterXpath);

    if (postsAreReady) {
        await selenium.sleep(2000);
        await selenium.scrollDown();
        var postElements = await selenium.findByXPath(postContainerXpath);

        if (postElements && postElements.length) {
            for (let i = 0; i < postElements.length; i++) {
                post = await scrapPost(i + 1);
                posts.push(post);
            }
        }
    }

    return posts;
}

async function scrapPost(i) {
    await selenium.clickOn(postSeeMoreBtnXpath.replace("{0}", i));
    await selenium.sleep(2000);
    var content = '';

    try {
        var post = await selenium.findByXPathSingle(postContentXpath.replace("{0}", i));
        content = await post.getText();
    } catch { }

    return {
        content: content
    }
}