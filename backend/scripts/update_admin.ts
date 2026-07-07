import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User, Role } from '../src/models/user.model';
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

async function updateAdmin() {
  const uri = buildMongoUri();
  if (!uri) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const newAdminEmail = 'brainseekerschessacademy@gmail.com';
  const newPassword = 'Admin@Brain2026';

  let admin = await User.findOne({ role: Role.ADMIN });
  
  if (admin) {
    admin.email = newAdminEmail;
    admin.passwordHash = await hashPassword(newPassword);
    await admin.save();
    console.log(`Updated existing admin to: ${newAdminEmail}`);
    console.log(`Password reset to: ${newPassword}`);
  } else {
    await User.create({
      email: newAdminEmail,
      passwordHash: await hashPassword(newPassword),
      role: Role.ADMIN,
      name: 'Academy Admin',
      mustChangePassword: false,
      isActive: true,
    });
    console.log(`Created new admin: ${newAdminEmail}`);
    console.log(`Password set to: ${newPassword}`);
  }

  await mongoose.disconnect();
  console.log('Update complete.');
}

updateAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
