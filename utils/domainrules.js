const config = require("../config.json")

domainrules = exports = module.exports = {};

domainrules.isAllowed = function (url) {
    // Load domain allowed
    const domainAllowed = config.puppeteer.domain;

    // Check if domain is allowed
    if (domainAllowed.indexOf(url) > -1)
        return true;

    return false;
}