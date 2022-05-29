const fs = require('fs');
const glob = require('glob');

const browser = require("./browser");
const caches = require("./utils/caches");
const removeScriptTags = require("./utils/removescripttags");

const config = require("./config.json");
// Init browser
browser.launch().then(() => {

    // Find cache in cache folder
    glob(`${config.cache.path}/*.json`, {}, async function (_, files) {
        for(let i = 0; i < files.length; i++){
            let cache = fs.readFileSync(files[i]);
            let json_data = JSON.parse(cache);

            // Load Page
            let responseHTML = await browser.load(json_data.url)

            // Set Variables for caching
            const headers = responseHTML.headers;
            const html = removeScriptTags(responseHTML.html);
            const status_code = responseHTML.status_code;
            
            // Save cache
            if(status_code >= 200 && status_code < 300)
                caches.save(json_data.url, status_code, headers, html);
        }

        // Kill browser
        browser.kill();
	// Kill Program
        process.exit(0)
    })
});

