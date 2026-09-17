import { Client, Databases, ID } from 'appwrite';

// Environment variables required for seeding
const endpoint = "http://13.233.156.184/v1";
const project = "awsugpune-in";
const databaseId = "6952aec8001347a8401b";
const collectionId = 'faq';

if (!endpoint || !project || !databaseId) {
  console.error('Missing required Appwrite environment variables. Please set VITE_PUBLIC_APPWRITE_ENDPOINT, VITE_PUBLIC_APPWRITE_PROJECT_ID, and VITE_PUBLIC_APPWRITE_DATABASE_ID.');
  process.exit(1);
}

// FAQ items to seed
const faqs = [
  {
    question: 'What is AWS User Group Pune?',
    answer:
      'AWS User Group Pune is a community-led, non-profit network for cloud enthusiasts, developers, architects, students, and IT professionals. We host meetups, workshops, and collaborative sessions to learn and build together on AWS.',
    category: 'General',
    order: 1,
    isActive: true,
  },
  {
    question: 'How often do community activities happen?',
    answer:
      'We organize regular community activities including meetups, learning sessions, and workshops across the year. Major milestones like AWS Community Day are part of this larger year-by-year community journey.',
    category: 'General',
    order: 2,
    isActive: true,
  },
  {
    question: 'Who can join AWSUG Pune?',
    answer:
      "Anyone interested in AWS and cloud technologies can join. Whether you're a beginner, student, developer, architect, DevOps engineer, or cloud enthusiast, the community is open and inclusive.",
    category: 'General',
    order: 3,
    isActive: true,
  },
  {
    question: 'Do I need to pay to join the community?',
    answer:
      'Most community meetups are free to attend. Some large-scale events or special workshops may require registration and ticketing based on venue, format, or workshop capacity.',
    category: 'Participation',
    order: 4,
    isActive: true,
  },
  {
    question: 'Are there hands-on workshops and practical sessions?',
    answer:
      'Yes. AWSUG Pune frequently organizes practical, hands-on sessions where members can build real solutions and learn from community practitioners and mentors.',
    category: 'Workshops',
    order: 5,
    isActive: true,
  },
  {
    question: 'How do I stay updated about upcoming activities?',
    answer:
      'Follow AWS User Group Pune on Meetup and LinkedIn, and enable website notifications for announcements about upcoming meetups, workshops, and major events.',
    category: 'General',
    order: 6,
    isActive: true,
  },
  {
    question: 'Can students and early-career builders participate?',
    answer:
      'Absolutely. The community is designed to support learners at every stage. Students and early-career professionals are encouraged to join, learn, and contribute.',
    category: 'Participation',
    order: 7,
    isActive: true,
  },
  {
    question: 'How can I contribute as a speaker, volunteer, or partner?',
    answer:
      'Reach out to us at aws.acd.pune@gmail.com. We welcome community speakers, volunteers, and ecosystem partners who want to help build meaningful learning experiences.',
    category: 'General',
    order: 8,
    isActive: true,
  },
];

async function main() {
  const client = new Client().setEndpoint(endpoint).setProject(project);
  const databases = new Databases(client);

  console.log(`Seeding ${faqs.length} FAQs into collection "${collectionId}" in database "${databaseId}"...`);

  for (const faq of faqs) {
    await databases.createDocument({
      databaseId,
      collectionId,
      documentId: ID.unique(),
      data: faq,
    });
    console.log(`Inserted FAQ: ${faq.question}`);
  }

  console.log('FAQ seeding completed.');
}

main().catch(err => {
  console.error('Seeding failed:', err?.message || err);
  process.exit(1);
});
