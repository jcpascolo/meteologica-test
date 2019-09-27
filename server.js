let express = require("express");
let path = require("path");
let serveStatic = require("serve-static");
const csp = require(`helmet-csp`);

app = express();
const docs = express.Router();

app.use(serveStatic(__dirname + "/dist"));

app.get("/docu/", function(req, res) {
  res.sendFile(__dirname + "/dist/docs.html");
});

app.use("/components", docs);

docs.get("/:filename", function(req, res) {
  const { filename } = req.params;
  res.sendFile(__dirname + `/dist/components/${filename}`);
});

let port = process.env.PORT || 5000;
app.listen(port);
