require("dotenv").config();
const express = require("express");
const useRoutes = require("./routes");

const app = express();
useRoutes(app);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});
