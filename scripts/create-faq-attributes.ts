import { Client, Databases } from 'node-appwrite';

// Configuration (override via env vars if needed)
const endpoint = "http://13.233.156.184/v1";
const project = "awsugpune-in";
const databaseId = "6952aec8001347a8401b";
const collectionId = 'faq';
const apiKey = "ebcf0c6115f1166fabb93b4737baae1db61a97863c2ff8b368b2c63a50bb9f94a158ef379e024c9f0714604b991753d39889e4e3822e8f1401f543570a7d03f1ed36866889bcc2ab01373d91ce73190b682f52a56eb19891c6a6edef501e6a6c0a62f99ea91d5816aa06e0e56ff535bf88489e97143a2a3a3d3d1b5691ebff5a";

if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY. Set it in your env before running this script.');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(project).setKey(apiKey);
const databases = new Databases(client);

const stringAttrs = [
  { key: 'question', size: 512, required: true },
  { key: 'answer', size: 8192, required: true },
  { key: 'category', size: 128, required: false },
];

const integerAttrs = [
  { key: 'order', required: false, min: 0, max: 10000 },
];

const booleanAttrs = [
  { key: 'isActive', required: false, default: true },
];

async function attributeExists(key: string) {
  const res = await databases.listAttributes(databaseId, collectionId);
  return res.attributes.some((attr: any) => attr.key === key);
}

async function createAttributes() {
  console.log(`Ensuring attributes exist in collection "${collectionId}"...`);

  for (const attr of stringAttrs) {
    if (await attributeExists(attr.key)) {
      console.log(`String attribute '${attr.key}' already exists, skipping.`);
      continue;
    }
    await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, attr.required);
    console.log(`Created string attribute '${attr.key}'.`);
  }

  for (const attr of integerAttrs) {
    if (await attributeExists(attr.key)) {
      console.log(`Integer attribute '${attr.key}' already exists, skipping.`);
      continue;
    }
    await databases.createIntegerAttribute(databaseId, collectionId, attr.key, attr.required, attr.min, attr.max);
    console.log(`Created integer attribute '${attr.key}'.`);
  }

  for (const attr of booleanAttrs) {
    if (await attributeExists(attr.key)) {
      console.log(`Boolean attribute '${attr.key}' already exists, skipping.`);
      continue;
    }
    await databases.createBooleanAttribute(databaseId, collectionId, attr.key, attr.required, attr.default);
    console.log(`Created boolean attribute '${attr.key}'.`);
  }

  console.log('Attribute creation requested. Wait until attributes are in "available" status, then run the seed script.');
}

createAttributes().catch(err => {
  console.error('Attribute creation failed:', err?.message || err);
  process.exit(1);
});
