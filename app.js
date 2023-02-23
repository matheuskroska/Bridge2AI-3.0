const completionRoute = require("./routes/completionRoute");
const imageRoute = require("./routes/imageRoute");
const imageEditRoute = require("./routes/imageEditRoute");
const authenticateRoute = require("./routes/authenticateRoute");
const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.post("/completion", completionRoute);

app.post("/image", imageRoute);

app.post("/image-edit", imageEditRoute);

app.post("/authenticate", authenticateRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
