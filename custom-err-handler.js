const { FAIL_STATUS } = require("./const");

class ErrorExtension extends Error {
  constructor(statusCode, msg) {
    super();
    this.statusCode = statusCode || 500;
    this.message = msg || "Unexpected exceptional happens";
    console.error("ERROR (500): ", this.message)
  }
}

const customErrHandler = (err, res) => {
  let statusCode = err.statusCode || 500;
  let msg = err.message || "Unexpected exceptional happens";
  console.error("ERROR (500): ", msg)
  res.status(statusCode).json({
    status: FAIL_STATUS,
    statusCode,
    msg,
  });
};

module.exports = {
  ErrorExtension,
  customErrHandler,
};
