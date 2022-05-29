expresstools = exports = module.exports = {};

const BypassHeaders = [
    "connection",
    "transfer-encoding",
    "content-encoding",
    "set-cookie"
]

expresstools.setHeaderWithJSON = async function (res, data) {
    // Convert JSON to key
    let keys = Object.keys(data)

    // Set headers
    for(let key of keys) {
        if(!BypassHeaders.includes(key)) {
            res.setHeader(key, data[key]);
        } 
    }
};

expresstools.setStatusAndHeader = async function (res, status_code, headers) {
    // Set headers
    expresstools.setHeaderWithJSON(res, headers);

    // Set Status code
    res.status(status_code);
};