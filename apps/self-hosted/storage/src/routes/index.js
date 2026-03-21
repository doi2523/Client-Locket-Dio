const mediaRoutes = require("./PresignedRoutes");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({ message: "🚀 Server is running!" });
  });

  app.use("/api", mediaRoutes);
};
