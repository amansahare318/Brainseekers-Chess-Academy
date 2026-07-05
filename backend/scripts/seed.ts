/**
 * Seeds default admin user. Run: npm run seed
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User, Role } from '../src/models/user.model';
import { Coach } from '../src/models/coach.model';
import { hashPassword } from '../src/services/auth.service';

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

async function seed() {
  const uri = buildMongoUri();
  if (!uri) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@brainseekers.com').toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@Brain2026';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`);
  } else {
    await User.create({
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: Role.ADMIN,
      name: 'Academy Admin',
      mustChangePassword: false,
      isActive: true,
    });
    console.log(`Created admin: ${adminEmail}`);
    console.log(`Temporary password (change after first login): ${adminPassword}`);
  }

  const coachEmail = (process.env.SEED_COACH_EMAIL || 'coach@brainseekers.com').toLowerCase();
  const coachPassword = process.env.SEED_COACH_PASSWORD || 'Coach@Brain2026';

  let coach = await Coach.findOne({ email: coachEmail });
  if (!coach) {
    coach = await Coach.create({
      name: 'Demo Coach',
      email: coachEmail,
      title: 'FIDE Instructor',
      elo: '2200',
    });
    console.log(`Created coach profile: ${coachEmail}`);
  }

  const coachUser = await User.findOne({ email: coachEmail });
  if (!coachUser) {
    const user = await User.create({
      email: coachEmail,
      passwordHash: await hashPassword(coachPassword),
      role: Role.COACH,
      name: coach.name,
      profileRef: coach._id,
      mustChangePassword: false,
      isActive: true,
    });
    coach.user = user._id;
    await coach.save();
    console.log(`Created coach login: ${coachEmail} / ${coachPassword}`);
  } else if (!coachUser.profileRef) {
    coachUser.profileRef = coach._id;
    await coachUser.save();
    coach.user = coachUser._id;
    await coach.save();
    console.log(`Linked existing coach user to profile`);
  } else {
    console.log(`Coach user already exists: ${coachEmail}`);
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
