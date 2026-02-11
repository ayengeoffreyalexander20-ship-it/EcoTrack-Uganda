
import { Video } from './types';

export const UGANDA_DISTRICTS = [
  'Mbarara', 'Kabale', 'Fort Portal', 'Kasese', 'Hoima', 'Masindi', 'Bushenyi', 
  'Rukungiri', 'Ntungamo', 'Kisoro', 'Kanungu', 'Ibanda', 'Isingiro', 'Kiruhura', 
  'Mitooma', 'Rubirizi', 'Sheema', 'Buhweju', 'Kamwenge', 'Kyegegwa', 'Kyenjojo', 
  'Bundibugyo', 'Ntoroko', 'Kakumiro', 'Kagadi', 'Kibaale', 'Rubanda'
];

export const EMISSION_FACTORS = {
  Transport: {
    'Car (Petrol)': 0.18,
    'Car (Diesel)': 0.17,
    'Motorbike (Boda)': 0.08,
    'Bus': 0.03,
    'Bicycle': 0,
    'Walking': 0
  },
  Energy: {
    'Electricity (Grid)': 0.45,
    'Charcoal (Traditional)': 2.88,
    'Improved Cookstove': 1.15,
    'Solar': 0.02,
    'LPG Gas': 0.23
  },
  Food: {
    'Meat (Beef/Goat)': 3.3,
    'Poultry/Fish': 1.8,
    'Vegetarian (Matooke/Beans)': 0.7,
    'Vegan': 0.5
  },
  Shopping: {
    'New Clothing': 0.12,
    'Electronics': 0.5,
    'Second Hand (Owino Style)': 0.02,
    'General Goods': 0.08
  }
};

export const SAMPLE_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Solar Power in Rural Uganda',
    description: 'Learn how remote villages are harnessing the sun to power schools and clinics.',
    category: 'Energy',
    thumbnail: 'https://picsum.photos/400/250?random=10',
    views: 12450,
    likes: 842,
    duration: '5:24',
    author: 'EcoPulse'
  },
  {
    id: '2',
    title: 'Sustainable Farming Techniques',
    description: 'A guide to organic farming and soil conservation in the heart of Uganda.',
    category: 'Food',
    thumbnail: 'https://picsum.photos/400/250?random=11',
    views: 8200,
    likes: 561,
    duration: '12:10',
    author: 'AgriUganda'
  }
];
