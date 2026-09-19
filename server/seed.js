/**
 * Demo data: npm run seed
 * Wipes users + news, then creates two demo writers and a set of stories.
 *   demo@groundreport.com / password123
 *   rina@groundreport.com / password123
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const News = require('./models/News');

const img = (seed) => `https://picsum.photos/seed/${seed}/1200/800`;

const stories = [
  {
    title: 'Riverside neighbourhood turns an empty lot into a shared vegetable garden',
    category: 'Lifestyle',
    summary: 'Forty families now grow tomatoes, chillies and greens on a plot that sat unused for a decade.',
    body: [
      'What was once a patch of rubble behind the old bus depot is now a green grid of raised beds. Residents began clearing the lot in March, using donated bricks, soil from nearby construction sites and a borrowed water pump.',
      'Each family looks after one bed and shares a rota for watering and composting. Organisers say the harvest is split between households, with a share set aside for the local school kitchen.',
      'The group is now asking the city council to grant the land on a long lease so the garden can stay for good.',
    ],
    tags: ['community', 'gardening', 'city'],
    views: 412,
  },
  {
    title: 'Startup builds low-cost water sensors for small farms',
    category: 'Technology',
    summary: 'A three-person team says its solar-powered sensors can cut irrigation costs by a fifth.',
    body: [
      'The sensors sit in the soil and send moisture readings to a farmer’s phone every hour, using a low-power radio network that works without mobile data.',
      'In a season-long trial across twelve rice and vegetable farms, growers using the readings watered less often and reported steadier yields, according to the team.',
      'The founders plan to open-source the hardware design so local workshops can assemble and repair the units.',
    ],
    tags: ['agritech', 'startups', 'iot'],
    views: 980,
  },
  {
    title: 'Local league final ends in a dramatic penalty shoot-out',
    category: 'Sports',
    summary: 'A packed stadium watched the underdogs win 5-4 on penalties after a goalless ninety minutes.',
    body: [
      'Neither side could find a breakthrough through regular time and two rounds of extra time, with both goalkeepers making saves that kept the crowd on its feet.',
      'The shoot-out went to sudden death before the winning side’s captain scored the decisive kick.',
      'The club, promoted only two seasons ago, said the trophy belongs to the supporters who travelled through the night to attend.',
    ],
    tags: ['football', 'league', 'final'],
    views: 1320,
  },
  {
    title: 'Small shops report busier weekends as night markets return',
    category: 'Business',
    summary: 'Traders near the old town say footfall has risen since the weekly night market reopened.',
    body: [
      'Shopkeepers along the main lane say customers who arrive for street food often stay to browse nearby stores that would normally close by early evening.',
      'Several owners have extended their hours and hired part-time staff for Fridays and Saturdays.',
      'The traders’ association is calling for better lighting and a designated parking zone to keep the momentum going.',
    ],
    tags: ['markets', 'retail', 'economy'],
    views: 356,
  },
  {
    title: 'Film festival opens with a hand-drawn animated feature',
    category: 'Entertainment',
    summary: 'The week-long festival will screen more than sixty short and feature films from across the region.',
    body: [
      'Opening night drew a full house for a hand-drawn animated feature that took its director six years to complete.',
      'Festival organisers said this year’s programme puts a spotlight on first-time filmmakers, with free morning screenings for students.',
      'Talks and workshops on sound design, editing and low-budget production run alongside the screenings.',
    ],
    tags: ['film', 'festival', 'animation'],
    views: 274,
  },
  {
    title: 'Health workers begin door-to-door screening for high blood pressure',
    category: 'Health',
    summary: 'Community nurses will visit thousands of homes over the next two months to check blood pressure.',
    body: [
      'The programme aims to catch high blood pressure early in adults who rarely visit a clinic. Each visit takes about ten minutes and includes advice on salt intake and physical activity.',
      'People with high readings will be referred to their nearest health centre for a follow-up check.',
      'Officials said the results will help plan where to place new screening points next year.',
    ],
    tags: ['health', 'community', 'prevention'],
    views: 640,
  },
  {
    title: 'Students map local birdlife with a phone app and a pair of binoculars',
    category: 'Science',
    summary: 'A school science club has logged more than ninety bird species in a single wetland.',
    body: [
      'Working in pairs, the students visit the wetland at dawn, note every species they see or hear and upload the sightings to a shared map.',
      'Their teacher says the project has turned abstract lessons on ecosystems into something students can see for themselves.',
      'Local conservation groups have asked to use the data in their yearly wetland report.',
    ],
    tags: ['birds', 'students', 'conservation'],
    views: 205,
  },
  {
    title: 'Regional leaders agree on a shared plan for flood warnings',
    category: 'World',
    summary: 'Neighbouring districts will share river-level data so villages downstream get earlier alerts.',
    body: [
      'Under the agreement, upstream gauges will send readings to a common dashboard that every district office can view in real time.',
      'Officials said earlier warnings could give families several extra hours to move livestock and belongings to higher ground.',
      'A joint drill is planned before the next monsoon season.',
    ],
    tags: ['flood', 'climate', 'cooperation'],
    views: 870,
  },
  {
    title: 'Council votes to extend library opening hours through exam season',
    category: 'Education',
    summary: 'Public libraries will stay open until 10pm on weekdays for the next three months.',
    body: [
      'Students had petitioned for longer hours, saying they lack a quiet place to study at home.',
      'The council approved the extension with extra funding for security and evening staff.',
      'Library managers said they will review attendance after the exam period before deciding whether to make the change permanent.',
    ],
    tags: ['libraries', 'students', 'council'],
    views: 523,
  },
  {
    title: 'City to test electric buses on its busiest commuter route',
    category: 'Politics',
    summary: 'A six-month trial will compare running costs, charging times and passenger comfort.',
    body: [
      'Ten electric buses will replace diesel vehicles on the line that carries the most commuters each morning.',
      'The transport office said the trial will decide whether to buy a larger fleet next year.',
      'Passengers can share feedback through a short survey posted inside every bus.',
    ],
    tags: ['transport', 'electric', 'city'],
    views: 761,
  },
  {
    title: 'Home bakers band together to launch a weekend cooperative',
    category: 'Business',
    summary: 'Twelve bakers will sell bread and pastries from a shared kitchen starting next month.',
    body: [
      'The cooperative rents a commercial kitchen by the hour, which lets members bake to order without buying their own equipment.',
      'Each baker keeps the profit from their own products and pays a small share into a fund for ingredients and repairs.',
      'The first pop-up stall opens at the weekend farmers’ market.',
    ],
    tags: ['bakery', 'cooperative', 'food'],
    views: 189,
  },
  {
    title: 'New study links regular walking to better sleep in older adults',
    category: 'Health',
    summary: 'Participants who walked thirty minutes a day reported falling asleep faster and waking less at night.',
    body: [
      'Researchers followed two hundred adults over sixty for four months, asking half of them to add a daily walk to their routine.',
      'The walking group reported better sleep quality by the second month, and the effect held through the end of the study.',
      'The authors note that the study was small and that larger trials are needed to confirm the findings.',
    ],
    tags: ['sleep', 'exercise', 'research'],
    views: 934,
  },
  {
    title: 'Coding bootcamp for teenagers fills up in two days',
    category: 'Education',
    summary: 'Organisers are adding a second batch after more than four hundred applications for sixty seats.',
    body: [
      'The free eight-week course teaches web basics through small projects such as a class timetable and a school newsletter.',
      'Mentors from local tech companies volunteer their evenings to review student work.',
      'The second batch will start next month, with a portion of seats reserved for girls and rural applicants.',
    ],
    tags: ['coding', 'teens', 'training'],
    views: 448,
  },
  {
    title: 'Volunteers repair worn footbridge before the rainy season',
    category: 'World',
    summary: 'Villagers replaced rotting planks and rusted rails over a single weekend.',
    body: [
      'The footbridge is the only safe route for children crossing the canal to reach school during the rains.',
      'Volunteers bought materials with money raised from a village fundraiser and worked from dawn until dusk.',
      'Local officials have promised to inspect the bridge every month and fund a full rebuild next year.',
    ],
    tags: ['village', 'volunteers', 'infrastructure'],
    views: 317,
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/news_portal');
  await Promise.all([User.deleteMany({}), News.deleteMany({})]);

  const users = await User.create([
    { name: 'Demo Reporter', email: 'demo@groundreport.com', password: 'password123', bio: 'Covering city life, one street at a time.' },
    { name: 'Rina Ahmed', email: 'rina@groundreport.com', password: 'password123', bio: 'Freelance writer on health and education.' },
  ]);

  const docs = stories.map((s, i) => ({
    title: s.title,
    summary: s.summary,
    content: s.body.join('\n\n'),
    category: s.category,
    tags: s.tags,
    views: s.views,
    imageUrl: img(`groundreport-${i + 1}`),
    author: users[i % users.length]._id,
    // stagger publish dates so "latest" ordering is meaningful
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 7),
  }));

  await News.insertMany(docs);
  console.log(`Seeded ${users.length} users and ${docs.length} stories.`);
  console.log('Login: demo@groundreport.com / password123');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
