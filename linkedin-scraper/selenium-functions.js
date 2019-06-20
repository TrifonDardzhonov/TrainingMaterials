var webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder().forBrowser('chrome').build();

exports.fn = {
    enterKey: function () {
        return webdriver.Key.ENTER;
    },
    maximize: async function () {
        await driver.manage().window().maximize();
    },
    navigate: async function (url) {
        await driver.navigate().to(url);
    },
    currentUrl: async function () {
        return driver.getCurrentUrl();
    },
    scrollToElement: async function (element) {
        await driver.executeScript("arguments[0].scrollIntoView(false);", element);
    },
    scrollTillTheBeginning: async function () {
        await driver.executeScript("window.scrollTo({top: 0, left: 0, behavior:'smooth'})");
    },
    scrollDown: async function (scrollTurn) {
        scrollTurn = scrollTurn || 0;

        var oldHeight = await this.pageHeight();
        await this.scrollToTheBottomOfThePage();
        await this.sleep(3000);
        var newHeight = await this.pageHeight();

        if (newHeight > oldHeight && scrollTurn < 10) {
            await this.scrollDown(scrollTurn + 1);
        }
    },
    pageHeight: async function () {
        return driver.executeScript("return document.documentElement.scrollHeight");
    },
    scrollToTheBottomOfThePage: async function () {
        return driver.executeScript("window.scrollTo({top: document.body.scrollHeight, left: 0, behavior:'smooth'})");
    },
    findByXPathSingle: async function (xPath) {
        try {
            return driver.findElement(webdriver.By.xpath(xPath));
        } catch (ex) {
            var message = xpath + " does not exist!";
            console.log(message);
            throw new Error(message);
        }
    },
    findByXPath: async function (xPath) {
        try {
            return driver.findElements(webdriver.By.xpath(xPath));
        } catch (ex) {
            var message = xpath + " does not exist!";
            console.log(message);
            throw new Error(message);
        }
    },
    findById: async function (id) {
        return driver.findElement(webdriver.By.id(id))
    },
    findByClassSingle: async function (className) {
        return driver.findElement(webdriver.By.className(className))
    },
    clickOn: async function (xPath) {
        var elements;

        try {
            elements = await driver.findElements(webdriver.By.xpath(xPath));
            elements = elements.filter(p => p !== undefined);
        } catch {
            return false;
        }

        if (elements && elements.length && elements[0]) {
            await this.scrollToElement(elements[0]);
            await elements[0].click();
            return true;
        } else {
            return false;
        }
    },
    sleep: async function (ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }
};