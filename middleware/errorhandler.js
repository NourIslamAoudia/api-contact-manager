const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    
    // Log l'erreur pour le débogage
    console.error('Error:', {
        statusCode,
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({
                success: false,
                title: 'Validation Error',
                message: err.message,
                statusCode: statusCode,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                success: false,
                title: 'Not Found',
                message: err.message,
                statusCode: statusCode,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({
                success: false,
                title: 'Unauthorized',
                message: err.message,
                statusCode: statusCode,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            });
            break;
        case constants.FORBIDDEN:
            res.json({
                success: false,
                title: 'Forbidden',
                message: err.message,
                statusCode: statusCode,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            });
            break;
        case constants.SERVER_ERROR:
            res.json({
                success: false,
                title: 'Server Error',
                message: err.message,
                statusCode: statusCode,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            });
            break;
        default:
            console.log('No specific error handler for status:', statusCode);
            res.json({
                success: false,
                title: 'Unknown Error',
                message: err.message || 'Une erreur inattendue s\'est produite',
                statusCode: statusCode,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            });
            break;
    }
};

module.exports = errorHandler;