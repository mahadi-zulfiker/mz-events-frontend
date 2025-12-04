import { z } from 'zod';

export const eventSchema = z
  .object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.enum([
      'CONCERT',
      'SPORTS',
      'GAMING',
      'FOOD',
      'TECH',
      'ART',
      'TRAVEL',
      'OTHER',
    ]),
    date: z.string(),
    time: z.string(),
    location: z.string().min(2, 'Location is required'),
    address: z.string().min(5, 'Address is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    minParticipants: z.number().int().positive(),
    maxParticipants: z.number().int().positive(),
    joiningFee: z.number().nonnegative(),
    imageUrl: z.string().url().optional(),
    status: z.enum(['OPEN', 'FULL', 'CANCELLED', 'COMPLETED']).optional(),
  })
  .refine((data) => data.maxParticipants > data.minParticipants, {
    path: ['maxParticipants'],
    message: 'Max participants must be greater than min participants',
  });
