module.exports = (asyncfn) => {
    return async (req, res, next) => {
        await asyncfn(req, res, next).catch((error) => {
            return next(error);
        })
    }
}
