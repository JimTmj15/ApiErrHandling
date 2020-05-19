const got = require("got").default;
const express = require("express");
const app = express();
const port = 3000;
const { ErrorExtension, customErrHandler } = require("./custom-err-handler.js");
const { INVALD_URL, INVALID_URL_ENDPOINT, VALID_URL_ENDPOINT, WEATHER_API, SUCCESS_STATUS } = require("./const")

//use to handle try and catch for the code snippet below (/getWithValidUrl & /getWithInvalidUrl)
const asyncHandler = (func) => {
  return (req, res, next) => {
    //catch exception throw from async function
    func(req, res, next).catch(next);
  };
};

//valid url endpoint
app.get(
  VALID_URL_ENDPOINT,
  asyncHandler(async (req, res, next) => {
    //sample weather api url
    let url = WEATHER_API;

    let result = await got(url);
    console.info("SUCCESS API CALL (200): ", "Successfully get result from URL: ", result.body)

    //check if the response status code equal to 200, if no, throw error
    if (result.statusCode !== 200) {
      throw new ErrorExtension(400, "Record not found");
    }

    //return positive result (200) if data available
    return res.status(200).json({
      result: result.body,
      status: SUCCESS_STATUS,
    });
  })
);

//invalid url endpoint
app.get(
  INVALID_URL_ENDPOINT,
  asyncHandler(async (req, res, next) => {
    //sample url
    let url = INVALD_URL;
    let result = await got(url);
    console.info("SUCCESS API CALL (200): ", "Successfully get result from URL")
    return res.status(200).json({
      result: result.body,
      status: SUCCESS_STATUS,
    });
  })
);

// act as filter to filter out invalid path entered by user
app.use((req, res, next) => {
  const err = new Error(`Not found: ${req.originalUrl}`);
  err.status = 500;
  next(err);
});

//act as filter processing for error
app.use((err, req, res, next) => {
  customErrHandler(err, res);
});

//listening to port
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
