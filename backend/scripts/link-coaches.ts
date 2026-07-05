/**
 * Links existing Coach documents to User accounts by email.
 * Run: npx ts-node --transpile-only scripts/link-coaches.ts
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User, Role } from '../src/models/user.model';
import { Coach } from '../src/models/coach.model';

dotenv.config();

const buildMongoUri = () => {
  const uri = process.env.MONGODB_URI || '';
  const dbName = process.env.MONGODB_DB_NAME || 'brainseekers';
  if (!uri) return '';
  if (uri.includes('mongodb.net/') && !uri.match(/mongodb\.net\/[^/?]+/)) {
    return uri.replace('mongodb.net/', `mongodb.net/${dbName}`);
  }
  return uri;
};

async function link() {
  const uri = buildMongoUri();
  if (!uri) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }
  await mongoose.connect(uri);

  const coaches = await Coach.find();
  let linked = 0;

  for (const coach of coaches) {
    const user = await User.findOne({ email: coach.email, role: Role.COACH });
    if (!user) {
      console.log(`Skip (no user): ${coach.email}`);
      continue;
    }
    user.profileRef = coach._id;
    await user.save();
    coach.user = user._id;
    await coach.save();
    linked++;
    console.log(`Linked: ${coach.name} <-> ${user.email}`);
  }

  console.log(`Done. Linked ${linked} of ${coaches.length} coaches.`);
  await mongoose.disconnect();
}

link().catch((e) => {
  console.error(e);
  process.exit(1);
});
