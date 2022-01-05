const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

require(".Develop/routing/route-html")(app);
require("./Develop/routing/route-api")(app);

app.use("/public", express.static('./Develop/public'));

app.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT)
});
