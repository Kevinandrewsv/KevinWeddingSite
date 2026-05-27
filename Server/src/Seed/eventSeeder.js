const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Event = require("../models/Event");

dotenv.config();

connectDB();

const events = [
  {
    title: "Engagement",
    date: "2025-06-21",
    time: "10:00 AM",
    venueName: "Add your engagement venue name",
    address: "Add your engagement venue address",
    mapLink: "Add your engagement Google Maps link",
    description: "Join us for our engagement celebration.",
    order: 1,
    isActive: true,
  },
  {
    title: "Marriage",
    date: "2025-06-25",
    time: "Add marriage time",
    venueName: "Add your marriage venue name",
    address: "Add your marriage venue address",
    mapLink: "Add your marriage Google Maps link",
    description:
      "With love and blessings, we invite you to our wedding celebration.",
    order: 2,
    isActive: true,
  },
];

const importEvents = async () => {
  try {
    await Event.deleteMany();

    await Event.insertMany(events);

    console.log("Events seeded successfully");
    process.exit();
  } catch (error) {
    console.error(`Seed Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyEvents = async () => {
  try {
    await Event.deleteMany();

    console.log("Events deleted successfully");
    process.exit();
  } catch (error) {
    console.error(`Delete Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyEvents();
} else {
  importEvents();
}