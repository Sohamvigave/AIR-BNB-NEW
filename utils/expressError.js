// this is used for handling synchronous errors
// but latest version of express handle it bydefault
class expressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    };
};

module.exports = expressError;