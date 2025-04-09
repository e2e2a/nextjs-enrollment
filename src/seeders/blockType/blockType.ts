'use server';
import BlockType from '@/models/BlockType';
import { blockTypeData } from './blockTypeData';

export const seedBlockType = async () => {
  await BlockType.deleteMany({});
  console.log('Cleaned BlockType Collection');
  await BlockType.insertMany(blockTypeData);
  console.log('BlockType seeding complete');
  return;
};
