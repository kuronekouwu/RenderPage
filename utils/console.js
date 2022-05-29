consoleCustom = exports = module.exports = {};

consoleCustom.log = function (task, message) {
    console.info(`[${new Date().toISOString() }] [${task}] ${message}`);
};