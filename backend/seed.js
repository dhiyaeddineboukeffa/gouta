import mongoose from 'mongoose';
import transportModel from './models/transportModel.js';

const seed = async () => {
  const hardcodedUri = 'mongodb://boukeffadhiyaeddine_db_user:iLzhb7wsdhZPxB0b@ac-nc2ndin-shard-00-00.vx0fcge.mongodb.net:27017,ac-nc2ndin-shard-00-01.vx0fcge.mongodb.net:27017,ac-nc2ndin-shard-00-02.vx0fcge.mongodb.net:27017/e-commerce?ssl=true&replicaSet=atlas-i2uygu-shard-0&authSource=admin&retryWrites=true&w=majority';
  await mongoose.connect(hardcodedUri, { family: 4 });
  
  await transportModel.deleteMany({});
  await transportModel.insertMany([
    { name: 'My own transportation (Free Pick Up)', fee: 0 },
    { name: 'Alger Center', fee: 500 },
    { name: 'Blida', fee: 800 },
    { name: 'Tipaza', fee: 1000 },
    { name: 'Boumerdes', fee: 1000 },
    { name: 'Tizi Ouzou', fee: 1500 }
  ]);
  
  console.log('Seeded');
  process.exit(0);
};

seed();
