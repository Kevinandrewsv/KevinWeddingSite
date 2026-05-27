const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const connectDB = require("./Config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        process.env.R2_ACCOUNT_ID
          ? "R2 env loaded successfully"
          : "R2 env not loaded"
      );
    });
  } catch (error) {
    console.error("Server Start Error:", error.message);
    process.exit(1);
  }
};

startServer();