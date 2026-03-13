const locketRouter = require("./locket.route.js");

module.exports = (app) => {
  app.use("/locket", locketRouter);
};
