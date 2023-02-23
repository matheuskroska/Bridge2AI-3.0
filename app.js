const completionRoute = require("./routes/completionRoute");
const imageRoute = require("./routes/imageRoute");
const imageEditRoute = require("./routes/imageEditRoute");
const authenticateRoute = require("./routes/authenticateRoute");
const app = require("./config").app;
const port = require("./config").port;

app.post("/completion", completionRoute);
app.post("/image", imageRoute);
app.post("/image-edit", imageEditRoute);
app.post("/authenticate", authenticateRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
