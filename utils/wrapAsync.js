// this is used for handling async errors
// but latest version of express handle it bydefault
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};