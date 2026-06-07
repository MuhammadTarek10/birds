import { customAlphabet } from 'nanoid';

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const LENGTH = 6;

const nano = customAlphabet(ALPHABET, LENGTH);

export const generatePodCode = (): string => nano();
