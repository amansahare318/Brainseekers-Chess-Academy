import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brainseekers';

const settingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.model('AcademySettings', settingsSchema, 'academysettings'); // Use the exact model/collection name if necessary

async function run() {
  await mongoose.connect(MONGO_URI);
  await Settings.updateOne({}, { 
    $set: { 
      whatsapp: "+918485079048",
      email: "brainseekerschessacademy@gmail.com",
      address: "New Manish Nagar , Nagpur , Maharashtra.",
      mobile: "+918485079048"
    } 
  }, { upsert: true });
  console.log("Updated AcademySettings");
  process.exit(0);
}

run();
