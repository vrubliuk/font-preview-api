const express = require("express");
const cors = require("cors");
const images = require("./images");
const fonts = require("./fonts");

module.exports = app => {
  app.use(cors());
  app.use("/api/images", images);
  app.use("/api/fonts", fonts);
  app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
  });
};
