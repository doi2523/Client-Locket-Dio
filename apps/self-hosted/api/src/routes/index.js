const locketRouter = require("./locket.route.js");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({ message: "🚀 Server is running!" });
  });

  app.use("/locket", locketRouter);
};
