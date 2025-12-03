'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ApiUser, Event, Review } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { FiMapPin, FiStar, FiEdit2 } from 'react-icons/fi';

interface ProfileData extends ApiUser {
  hostedEvents?: Event[];
  participants?: any[];
  receivedReviews?: Review[];
}

const updateSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  bio: z.string().max(500).optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  interests: z.string().optional().or(z.literal('')),
  profileImage: z.string().url().optional().or(z.literal('')),
});

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [hosted, setHosted] = useState<Event[]>([]);
  const [joined, setJoined] = useState<Event[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
  });

  const isOwnProfile = useMemo(() => user?.id === params.id, [user?.id, params.id]);

  useEffect(() => {
    if (params.id) {
      loadProfile();
    }
  }, [params.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, eventsRes, reviewsRes] = await Promise.all([
        axios.get(`/users/${params.id}`),
        axios.get(`/users/${params.id}/events`),
        axios.get(`/users/${params.id}/reviews`),
      ]);
      setProfile(profileRes.data.data);
      setHosted(eventsRes.data.data.hosted);
      setJoined(eventsRes.data.data.joined);
      setReviews(reviewsRes.data.data);

      const p = profileRes.data.data as ProfileData;
      setValue('fullName', p.fullName);
      setValue('bio', p.bio || '');
      setValue('location', p.location || '');
      setValue('profileImage', p.profileImage || '');
      setValue('interests', p.interests?.join(', ') || '');
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (values: z.infer<typeof updateSchema>) => {
    try {
      await axios.patch(`/users/${params.id}`, {
        ...values,
        interests: values.interests
          ? values.interests
              .split(',')
              .map((i) => i.trim())
              .filter(Boolean)
          : [],
      });
      toast.success('Profile updated');
      setEditing(false);
      loadProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    try {
      const res = await uploadImageToCloudinary(file);
      setValue('profileImage', res.secure_url);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white">Profile not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar src={profile.profileImage} fallback={profile.fullName} className="h-24 w-24" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{profile.fullName}</h1>
              <Badge className="bg-white/10 border-white/10 text-white">{profile.role}</Badge>
              {profile.averageRating && (
                <span className="inline-flex items-center gap-1 text-amber-300 text-sm">
                  <FiStar className="fill-current" />
                  {profile.averageRating}
                </span>
              )}
            </div>
            <p className="text-slate-200">{profile.bio || 'No bio yet.'}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <span>{profile.email}</span>
              {profile.location && (
                <span className="inline-flex items-center gap-1">
                  <FiMapPin /> {profile.location}
                </span>
              )}
            </div>
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <Badge variant="outline" key={i} className="bg-white/5 border-white/10 text-white">
                    {i}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {isOwnProfile && (
            <Button variant="outline" onClick={() => setEditing((p) => !p)} className="flex items-center gap-2">
              <FiEdit2 /> {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          )}
        </div>

        {editing && (
          <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white">Update profile</h3>
            <form className="space-y-4" onSubmit={handleSubmit(onUpdate)}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Full name</label>
                  <Input {...register('fullName')} className="bg-white/5 border-white/10 text-white" />
                  {errors.fullName && (
                    <p className="text-sm text-red-400">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Location</label>
                  <Input {...register('location')} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Bio</label>
                <Textarea rows={3} {...register('bio')} className="bg-white/5 border-white/10 text-white" />
                {errors.bio && <p className="text-sm text-red-400">{errors.bio.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Interests (comma separated)</label>
                <Input {...register('interests')} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Profile image</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="url"
                    placeholder="https://"
                    {...register('profileImage')}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files?.[0] || undefined)}
                    className="text-sm text-slate-200"
                  />
                </div>
              </div>
              <Button type="submit" loading={isSubmitting}>
                Save changes
              </Button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <StatCard label="Events Hosted" value={hosted.length} />
          <StatCard label="Events Joined" value={joined.length} />
          <StatCard label="Reviews Received" value={reviews.length} />
        </div>

        {hosted.length > 0 && (
          <Section title="Hosted Events">
            <div className="grid md:grid-cols-2 gap-4">
              {hosted.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          </Section>
        )}

        {joined.length > 0 && (
          <Section title="Joined Events">
            <div className="grid md:grid-cols-2 gap-4">
              {joined.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          </Section>
        )}

        {reviews.length > 0 && (
          <Section title="Reviews Received">
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={r.user.profileImage} fallback={r.user.fullName} />
                    <div>
                      <p className="font-semibold text-white">{r.user.fullName}</p>
                      <p className="text-xs text-slate-300">{r.event?.title}</p>
                    </div>
                    <span className="ml-auto text-sm text-amber-300">{r.rating}/5</span>
                  </div>
                  <p className="text-sm text-slate-200 mt-2">{r.comment || 'No comment'}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {format(new Date(r.createdAt), 'PP')}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
      <Footer />
    </div>
  );
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="glass-panel rounded-xl border border-white/10 p-4 shadow-lg">
    <p className="text-sm text-slate-300">{label}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    {children}
  </div>
);

const EventRow = ({ event }: { event: Event }) => (
  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-white">{event.title}</p>
        <p className="text-xs text-slate-300">
          {format(new Date(event.date), 'PP')} at {event.time}
        </p>
      </div>
      <Badge variant="outline" className="bg-white/5 border-white/10 text-white">
        {event.status}
      </Badge>
    </div>
    <p className="text-sm text-slate-200 mt-2 line-clamp-2">{event.description}</p>
  </div>
);
