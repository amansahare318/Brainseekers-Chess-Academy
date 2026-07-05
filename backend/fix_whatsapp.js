import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://brainseekers_admin:brainseekers567@brainseekers-db.w7tevqw.mongodb.net/brainseekers?appName=brainseekers-db';

console.log('Connecting to Atlas...');
await mongoose.connect(MONGO_URI);
console.log('Connected!');

const db = mongoose.connection.db;

// List collections to verify
const cols = await db.listCollections().toArray();
console.log('Collections:', cols.map(c => c.name));

const result = await db.collection('academysettings').updateOne(
  {},
  { $set: { whatsapp: '919876543210' } }
);
console.log('Modified:', result.modifiedCount, '| Matched:', result.matchedCount);

const doc = await db.collection('academysettings').findOne({}, { projection: { whatsapp: 1 } });
console.log('Current whatsapp value in DB:', doc?.whatsapp);

await mongoose.disconnect();
console.log('Done.');
