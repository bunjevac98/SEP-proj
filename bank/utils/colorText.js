const chalk = require('chalk');

module.exports = {
    connected: chalk.bold.cyan,
    error: chalk.bold.yellow,
    disconnected: chalk.bold.red,
    termination: chalk.bold.magenta,
    ok: chalk.bold.green,
    server_start: chalk.white.bgGreen.bold,
    mongoose_start: chalk.white.bgBlue.bold,
};
