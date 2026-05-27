const dotenv = require("dotenv");
const connectDB = require("../Config/db");
const Admin = require("../Models/Admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@wedding.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Wedding Admin";

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.name = adminName;
      existingAdmin.email = adminEmail;
      existingAdmin.password = adminPassword;

      await existingAdmin.save();

      console.log("Admin updated successfully");
      console.log(`Email: ${adminEmail}`);
      process.exit(0);
    }

    await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
    });

    console.log("Admin created successfully");
    console.log(`Email: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();