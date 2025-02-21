const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? 'stack' : err.stack
    });
};

module.exports = errorHandler;