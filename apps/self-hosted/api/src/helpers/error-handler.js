const logEvents = require("./log-events");
const { v4: uuid } = require("uuid");

module.exports = (err, req, res, next) => {
    const errorId = uuid();
    logEvents(
        `idError ----- ${errorId} ----- ${req.url} ----- ${req.method} ----- ${err.message}`
    );

    // Kiểm tra xem headers đã được gửi chưa
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
            errorId,
        },
    });
};
