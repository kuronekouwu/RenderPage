const express = require("express")
const validUrl = require('valid-url');

const browser = require("./browser")

const console = require("./utils/console")
const expresstools = require("./utils/expresstools")
const caches = require("./utils/caches");
const removeScriptTags = require("./utils/removescripttags");

const config = require("./config.json")

// Init express
const app = express()
// Init Cache
caches.init();

// Remove x-powered-by header
app.disable('x-powered-by')

// Config
const task = "Express"
const port = config.server.port

app.get('/', (req, res) => {
    if(validUrl.isUri(req.query.url)) {
        // Get HTML cache
        let cache_html = caches.get(req.query.url);

        // Check if cache is valid
        if(cache_html != null) {
            // Log User-agent, url and status code
            console.log(task, `${req.headers['user-agent']} - (${cache_html.url}) - ${cache_html.status_code} (Got cached)`);

            // Send cached html
            expresstools.setStatusAndHeader(res, cache_html.status_code, cache_html.headers);

            // Send html
            return res.send(cache_html.html);
        }
            
        // Send URL to browser
        return browser.load(req.query.url).then((responseHTML) => {
            // Check if responseHTML is undefined
            if(responseHTML === undefined)
                return res.status(403).send("URL is not allowed");

            // Check if responseHTML is empty
            if(responseHTML === null)
                return res.status(404).send("URL not found")

            // Log User-agent, url and status code
            console.log(task, `${req.headers['user-agent']} - (${req.query.url}) - ${responseHTML.status_code}`);
            
            // Set Variables for caching
            const headers = responseHTML.headers;
            const html = removeScriptTags(responseHTML.html);
            const status_code = responseHTML.status_code;

            // Save cache
            if(status_code >= 200 && status_code < 300)
                caches.save(req.query.url, status_code, headers, html);

            // Set Status and Headers
            expresstools.setStatusAndHeader(res, status_code, headers);

            // Send HTML
            return res.send(html);
        })
    }
    
    return res.sendStatus(400);
})

app.listen(port, () => {
    // Launch puppeteer
    browser.launch()
    console.log(task, `Server is running on http://localhost:${port}`)
})

process.on('SIGINT', () => {
    // Close puppeteer
    browser.kill()
    process.exit(0)
})