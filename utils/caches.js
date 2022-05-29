const fs = require('fs');
const cryptojs = require('crypto-js');
const console = require("../utils/console")

const config = require("../config.json")

caches = exports = module.exports = {};

path = config.cache.path;

const task = "Caching";

md5 = (str) => {
    return cryptojs.MD5(str).toString();
}

caches.init = function () {
    // Check dir is exist
    if (!fs.existsSync(path)) {
        // Create dir
        fs.mkdirSync(path);
    }
}

caches.save = async function (url, status_code, headers, html) {
    // Convert url to md5
    const key = md5(url);

    // Save cache
    fs.writeFileSync(`${path}/${key}.json`, JSON.stringify({
        "url": url,
        "cached_at": new Date().toISOString(),
        "status_code": status_code,
        "headers": headers
    }));
    fs.writeFileSync(`${path}/${key}.html`, html);
}

caches.get = function (url) {
    // Convert url to md5
    const key = md5(url);

    // Get cache
    const json_path = `${path}/${key}.json`;
    const html_path = `${path}/${key}.html`;

    if (fs.existsSync(json_path) && fs.existsSync(html_path)) {
        const html = fs.readFileSync(html_path, 'utf8');
        const json = fs.readFileSync(json_path, 'utf8');

        // Prase json
        const json_data = JSON.parse(json);

        if(!(new Date().getTime() <= new Date(json_data.cached_at).getTime() + (config.cache.maxAge * 1000))){
            fs.unlinkSync(html_path);
            fs.unlinkSync(json_path);
            console.log(task, `${url} is expired`);
            return null;
        }

        return {
            "id": key,
            "url": url,
            "status_code": json_data.status_code,
            "headers": json_data.headers,
            "html": html
        }
    }

    return null;
};
