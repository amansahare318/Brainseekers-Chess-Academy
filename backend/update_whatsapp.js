import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brainseekers';

const settingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.model('Settings', settingsSchema);

async function run() {
  await mongoose.connect(MONGO_URI);
  await Settings.updateOne({}, { $set: { whatsapp: "+1234567890" } });
  console.log("Updated WhatsApp number");
  process.exit(0);
}

run();
