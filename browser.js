const puppeteer = require('puppeteer');

const console = require("./utils/console")
const domainrules = require("./utils/domainrules")

const config = require("./config.json")

// Config
const task = "Puppeteer"

// Puppeteer Config
const puppeteerConfig = config.puppeteer;

const headless = puppeteerConfig.headless;
const timeoutWaitPage = puppeteerConfig.page.timeout; // 10 seconds
const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=800,600'
]

browser = exports = module.exports = {};

browser.launch = async function() {
    console.log(task, "Launching browser...")
    browser.browser = await puppeteer.launch({
        headless: headless,
        args: args
    });
};

browser.load = async function(url) {
    let response;
    let content;
    let urlparse = new URL(url).origin;

    if(!(domainrules.isAllowed(urlparse))){
        console.log(task, `Domain ${urlparse} is not allowed`)
        return undefined;
    }

    console.log(task, `Loading page ${url}...`);

    // Start time
    const start = new Date().getTime();

    // Create page
    page = await browser.browser.newPage();

    // Set User-agent
    await page.setUserAgent(config.puppeteer.useragent);

    // Go to url with waiting network is idle
    let failedCount = 0;
    let failedMax = puppeteerConfig.page.maxFailures;

    while(true){
        try {
            response = await page.goto(url, {waitUntil: 'networkidle0', timeout: timeoutWaitPage});

            // Get Page content
            content = await page.content();

            break;
        } catch (e) {
            // If failed, try again (max 2 times)
            
            // Add 1 to failed count
            failedCount++;

            // If failed count is equal to max failed count, return null
            if(failedCount >= failedMax) {
                console.log(task, "Failed to load page", e);
                return null;
            }
            
            // Reload page
            await page.reload();
            console.log(task, `Failed to load page, retrying... ${failedCount} / ${failedMax}`);
        }
    }
    
    // Close Page
    await page.close();

    // End time
    const end = new Date().getTime();
    console.log(task, `Page loaded in ${end - start}ms`)

    return {
        "url": url,
        "status_code": response.status(),
        "headers": response.headers(),
        "html": content
    };
};

browser.kill = async function() {
  console.log(task, "Killing browser...")
  return await browser.browser.close();
};

