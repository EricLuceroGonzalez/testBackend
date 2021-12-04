const express = require("express");
const app = express();
const cors = require("cors");
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
const { createProxyMiddleware } = require('http-proxy-middleware');
const { proxy } = require('http-proxy-middleware');
// Bring route file:
const unsplashRoute = require('../routes/unsplash')

dotenv.config();
// TODO: Check this is deprecated
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize CORS middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use("/unsplashApi", unsplashRoute);


// Error handler when no endpoint or direction is found "NEXT()""
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});
// Error Middleware

// Special middleware function - Express knows is Error Handling (4 parameters)
app.use((error, req, res, next) => {
    // Find the file on the request and ERROR ---> Not save
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(`The error on file: ${err}`);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error ocurred" });
});

const port = process.env.PORT || 3001;
module.exports = { app, port };