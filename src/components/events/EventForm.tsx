/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@/lib/validators';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Event } from '@/types';

type EventFormValues = z.infer<typeof eventSchema>;

const categories = [
  { value: 'CONCERT', label: 'Concert' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'GAMING', label: 'Gaming' },
  { value: 'FOOD', label: 'Food' },
  { value: 'TECH', label: 'Tech' },
  { value: 'ART', label: 'Art' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'OTHER', label: 'Other' },
];

export const EventForm = ({
  initialData,
  onSubmit,
  submitLabel = 'Create Event',
}: {
  initialData?: Partial<Event>;
  onSubmit: (values: EventFormValues) => Promise<void>;
  submitLabel?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const fieldStyles = 'bg-white/5 border-white/10 text-white placeholder:text-slate-300';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: (initialData?.category as any) || 'OTHER',
      date: initialData?.date ? initialData.date.split('T')[0] : '',
      time: initialData?.time || '',
      location: initialData?.location || '',
      address: initialData?.address || '',
      latitude: initialData?.latitude ?? undefined,
      longitude: initialData?.longitude ?? undefined,
      minParticipants: initialData?.minParticipants || 1,
      maxParticipants: initialData?.maxParticipants || 10,
      joiningFee: initialData?.joiningFee ? Number(initialData.joiningFee) : 0,
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadImageToCloudinary(file);
      setValue('imageUrl', res.secure_url);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Title</label>
          <Input placeholder="Event title" {...register('title')} className={fieldStyles} />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Category</label>
          <Select {...register('category')} className={fieldStyles}>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Date</label>
          <Input type="date" {...register('date')} className={fieldStyles} />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Time</label>
          <Input type="time" {...register('time')} className={fieldStyles} />
          {errors.time && (
            <p className="text-sm text-red-600">{errors.time.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Location</label>
          <Input placeholder="City / Area" {...register('location')} className={fieldStyles} />
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Address</label>
          <Input placeholder="Address" {...register('address')} className={fieldStyles} />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Latitude</label>
          <Input
            type="number"
            step="any"
            placeholder="Optional"
            {...register('latitude', { valueAsNumber: true })}
            className={fieldStyles}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Longitude</label>
          <Input
            type="number"
            step="any"
            placeholder="Optional"
            {...register('longitude', { valueAsNumber: true })}
            className={fieldStyles}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Min Participants</label>
          <Input
            type="number"
            min={1}
            {...register('minParticipants', { valueAsNumber: true })}
            className={fieldStyles}
          />
          {errors.minParticipants && (
            <p className="text-sm text-red-600">{errors.minParticipants.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Max Participants</label>
          <Input
            type="number"
            min={1}
            {...register('maxParticipants', { valueAsNumber: true })}
            className={fieldStyles}
          />
          {errors.maxParticipants && (
            <p className="text-sm text-red-600">{errors.maxParticipants.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Joining Fee (USD)</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register('joiningFee', { valueAsNumber: true })}
            className={fieldStyles}
          />
          {errors.joiningFee && (
            <p className="text-sm text-red-600">{errors.joiningFee.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Cover Image</label>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
              className="text-slate-200"
            />
            <Button type="button" variant="ghost" loading={uploading}>
              Upload
            </Button>
          </div>
          {errors.imageUrl && (
            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
          {initialData?.imageUrl && (
            <img
              src={initialData.imageUrl}
              alt="cover"
              className="mt-2 h-24 w-full max-w-xs rounded-lg object-cover"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Description</label>
        <Textarea
          rows={5}
          placeholder="Describe your event"
          {...register('description')}
          className={fieldStyles}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
};
