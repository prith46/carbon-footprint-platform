import type { ActivityCategory } from '../types';

export const EMISSION_FACTORS: Record<string, number> = {
  'car': 0.21,
  'bus': 0.089,
  'train': 0.041,
  'bicycle': 0,
  'walking': 0,
  'flight': 0.255,
  'beef': 6.61,
  'chicken': 3.0,
  'pork': 3.3,
  'fish': 1.34,
  'vegetarian meal': 0.7,
  'vegan meal': 0.4,
  'electricity': 0.233,
  'natural gas': 0.184,
  'heating oil': 2.54,
  'clothing': 10.0,
  'electronics': 50.0,
  'furniture': 30.0,
  'groceries': 3.0,
};

export interface ActivityOption {
  category: ActivityCategory;
  activity: string;
  unit: string;
  factor: number;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  { category: 'transport', activity: 'car', unit: 'km', factor: 0.21 },
  { category: 'transport', activity: 'bus', unit: 'km', factor: 0.089 },
  { category: 'transport', activity: 'train', unit: 'km', factor: 0.041 },
  { category: 'transport', activity: 'bicycle', unit: 'km', factor: 0 },
  { category: 'transport', activity: 'walking', unit: 'km', factor: 0 },
  { category: 'transport', activity: 'flight', unit: 'km', factor: 0.255 },
  { category: 'food', activity: 'beef', unit: 'serving', factor: 6.61 },
  { category: 'food', activity: 'chicken', unit: 'serving', factor: 3.0 },
  { category: 'food', activity: 'pork', unit: 'serving', factor: 3.3 },
  { category: 'food', activity: 'fish', unit: 'serving', factor: 1.34 },
  { category: 'food', activity: 'vegetarian meal', unit: 'serving', factor: 0.7 },
  { category: 'food', activity: 'vegan meal', unit: 'serving', factor: 0.4 },
  { category: 'energy', activity: 'electricity', unit: 'kWh', factor: 0.233 },
  { category: 'energy', activity: 'natural gas', unit: 'kWh', factor: 0.184 },
  { category: 'energy', activity: 'heating oil', unit: 'liter', factor: 2.54 },
  { category: 'shopping', activity: 'clothing', unit: 'item', factor: 10.0 },
  { category: 'shopping', activity: 'electronics', unit: 'item', factor: 50.0 },
  { category: 'shopping', activity: 'furniture', unit: 'item', factor: 30.0 },
  { category: 'shopping', activity: 'groceries', unit: 'bag', factor: 3.0 },
];

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  transport: 'Transport',
  food: 'Food',
  energy: 'Energy',
  shopping: 'Shopping',
};

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  transport: '#2563eb',
  food: '#059669',
  energy: '#d97706',
  shopping: '#7c3aed',
};
