let express = require("express");
let path = require("path");
let serveStatic = require("serve-static");
const csp = require(`helmet-csp`);

app = express();
const docs = express.Router();

app.use(serveStatic(__dirname + "/dist"));

app.use(
  csp({
    directives: {
      // scriptSrc: [
      //   `'self'`,
      //   `'unsafe-inline'`,
      //   `'unsafe-eval'`,
      //   `unpkg.com/docute@4/dist/docute.js`
      // ]
      defaultSrc: [`'none'`]
      // imgSrc: [`'self'`, `imgur.com`]
    }
  })
);

app.get("/docu/", function(req, res) {
  res.sendFile(__dirname + "/dist/website/index.html");
});

app.use("/components", docs);

docs.get("/:filename", function(req, res) {
  const { filename } = req.params;
  res.sendFile(__dirname + `/dist/website/components/${filename}`);
});

let port = process.env.PORT || 5000;
app.listen(port);
