/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
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
import dynamic from 'next/dynamic';

const MapContainer = dynamic(async () => (await import('react-leaflet')).MapContainer, { ssr: false });
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });

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

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'FULL', label: 'Full' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const EventForm = ({
  initialData,
  onSubmit,
  submitLabel = 'Create Event',
  allowStatusChange = false,
}: {
  initialData?: Partial<Event>;
  onSubmit: (values: EventFormValues) => Promise<void>;
  submitLabel?: string;
  allowStatusChange?: boolean;
}) => {
  const [uploading, setUploading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const fieldStyles = 'bg-white/5 border-white/10 text-white placeholder:text-slate-300';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
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
      status: initialData?.status || 'OPEN',
    },
  });
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    (async () => {
      const lf = await import('leaflet');
      lf.Marker.prototype.options.icon = lf.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setMapReady(true);
    })();
  }, []);

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

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    setValue('latitude', Number(lat.toFixed(6)));
    setValue('longitude', Number(lng.toFixed(6)));
    toast.success('Pinned location on map');
  };

  const markerPosition =
    typeof latitude === 'number' &&
    !Number.isNaN(latitude) &&
    typeof longitude === 'number' &&
    !Number.isNaN(longitude)
      ? ([Number(latitude), Number(longitude)] as [number, number])
      : undefined;

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

        {allowStatusChange && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Event Status</label>
            <Select {...register('status')} className={fieldStyles}>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-slate-400">
              Mark as completed once the event is done to unlock attendee reviews.
            </p>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message as string}</p>
            )}
          </div>
        )}

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

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-200">Map (click to drop a pin)</label>
          <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
            {!mapReady ? (
              <div className="h-64 animate-pulse bg-white/5" />
            ) : (
              <div className="h-64">
                <MapContainer
                  center={(markerPosition || [40, -95]) as [number, number]}
                  zoom={markerPosition ? 10 : 3}
                  scrollWheelZoom
                  style={{ height: '100%', width: '100%' }}
                  onClick={handleMapClick as any}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {markerPosition && <Marker position={markerPosition as any} />}
                </MapContainer>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Add coordinates for map and discovery views. Tap anywhere to update latitude/longitude automatically.
          </p>
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
