/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiShield,
  FiArrowLeft,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { PaymentModal } from '@/components/events/PaymentModal';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Event, Review } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const statusBadge: Record<string, any> = {
  OPEN: 'success',
  FULL: 'warning',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
};

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [review, setReview] = useState<{ rating: number; comment: string }>({
    rating: 5,
    comment: '',
  });

  const participantCount = event?._count?.participants ?? 0;
  const isHost = event && user?.id === event.hostId;
  const isParticipant = useMemo(
    () => event?.participants?.some((p) => p.userId === user?.id) ?? false,
    [event, user?.id]
  );

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/events/${params.id}`);
      setEvent(data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const joinFreeEvent = async (paymentId?: string) => {
    if (!event) return;
    await axios.post(`/events/${event.id}/join`, {
      paymentStatus: paymentId ? 'COMPLETED' : undefined,
      paymentId,
    });
    toast.success('Joined event');
    fetchEvent();
  };

  const handleJoin = async () => {
    if (!user) {
      toast.error('Please login to join events');
      router.push('/login');
      return;
    }
    if (!event) return;
    if (event.joiningFee > 0) {
      setShowPaymentModal(true);
      return;
    }
    try {
      setActionLoading(true);
      await joinFreeEvent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!event) return;
    try {
      setActionLoading(true);
      await axios.post(`/events/${event.id}/leave`);
      toast.success('Left event');
      fetchEvent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to leave');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!event || !user) return;
    if (!isParticipant || event.status !== 'COMPLETED') {
      toast.error('You can only review after attending a completed event');
      return;
    }
    try {
      setActionLoading(true);
      await axios.post('/reviews', {
        eventId: event.id,
        hostId: event.hostId,
        rating: review.rating,
        comment: review.comment,
      });
      toast.success('Review submitted');
      setReview({ rating: 5, comment: '' });
      fetchEvent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white">Event not found</h1>
        </div>
      </div>
    );
  }

  const cover =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.25),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.2),transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-slate-200">
            <FiArrowLeft /> Back
          </Button>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl shadow-indigo-900/40">
            <div className="h-80 relative">
              <img src={cover} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
                <Badge variant={statusBadge[event.status] || 'default'}>{event.status}</Badge>
                <h1 className="text-4xl font-bold text-white drop-shadow">{event.title}</h1>
                <p className="max-w-3xl text-lg text-slate-100">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-indigo-50">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <FiClock /> {format(new Date(event.date), 'PPPP')} at {event.time}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <FiMapPin /> {event.location}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                    <FiUsers /> {participantCount}/{event.maxParticipants} attending
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel rounded-2xl border border-white/10 p-6 flex items-center gap-4">
                  <Avatar src={event.host.profileImage} fallback={event.host.fullName} className="h-14 w-14" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-white">{event.host.fullName}</p>
                      <Badge variant="outline" className="flex items-center gap-1 bg-white/5 border-white/10 text-white">
                        <FiShield className="text-indigo-300" /> Host
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">{event.host.location || 'Location pending'}</p>
                    {event.host.averageRating && (
                      <div className="flex items-center gap-1 text-sm text-amber-300">
                        <FiStar className="fill-current" />
                        <span>{event.host.averageRating} rating</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => router.push(`/profile/${event.host.id}`)}>
                    View profile
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <DetailPill title="Fee" value={event.joiningFee > 0 ? `$${event.joiningFee}` : 'Free'} />
                  <DetailPill title="Min participants" value={event.minParticipants} />
                  <DetailPill title="Address" value={event.address} />
                </div>

                <SectionCard
                  title="Participants"
                  badgeLabel={`${participantCount} attending`}
                  id="participants"
                >
                  {participantCount === 0 ? (
                    <p className="text-slate-300">No participants yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.participants?.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                        >
                          <Avatar src={p.user.profileImage} fallback={p.user.fullName} />
                          <div>
                            <p className="font-semibold text-white">{p.user.fullName}</p>
                            <p className="text-xs text-slate-300">{p.paymentStatus}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard
                  title="Reviews"
                  badgeLabel={
                    event.status === 'COMPLETED' && isParticipant && !isHost ? 'You attended' : undefined
                  }
                  id="reviews"
                >
                  {event.reviews && event.reviews.length > 0 ? (
                    <div className="grid gap-4">
                      {event.reviews.map((r: Review) => (
                        <div key={r.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar src={r.user.profileImage} fallback={r.user.fullName} />
                            <div>
                              <p className="font-semibold text-white">{r.user.fullName}</p>
                              <div className="flex items-center text-amber-300 text-sm">
                                <FiStar className="fill-current" />
                                <span className="ml-1">{r.rating}/5</span>
                              </div>
                            </div>
                            <span className="ml-auto text-xs text-slate-400">
                              {format(new Date(r.createdAt), 'PP')}
                            </span>
                          </div>
                          <p className="text-slate-200 text-sm">{r.comment || 'No comment'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-300">No reviews yet.</p>
                  )}

                  {event.status === 'COMPLETED' && isParticipant && !isHost && (
                    <div className="rounded-lg border border-indigo-200/40 bg-indigo-500/10 p-4 space-y-3">
                      <p className="font-semibold text-white">Leave a review</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={review.rating}
                          onChange={(e) => setReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                          className="w-24 border-white/20 bg-white/10 text-white"
                        />
                        <span className="text-sm text-slate-200">1-5 stars</span>
                      </div>
                      <Textarea
                        rows={3}
                        placeholder="Share your experience"
                        value={review.comment}
                        onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
                        className="border-white/20 bg-white/10 text-white placeholder:text-slate-300"
                      />
                      <Button onClick={handleReviewSubmit} loading={actionLoading}>
                        Submit review
                      </Button>
                    </div>
                  )}
                </SectionCard>
              </div>

              <div className="space-y-4">
                {!isHost && (
                  <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-white">Join this event</h3>
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>Spots</span>
                      <span>
                        {participantCount}/{event.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>Fee</span>
                      <span className="text-lg font-bold text-indigo-300">
                        {event.joiningFee > 0 ? `$${event.joiningFee}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <FiShield /> Payments are test mode only.
                    </div>
                    {isParticipant ? (
                      <Button variant="outline" onClick={handleLeave} loading={actionLoading}>
                        Leave event
                      </Button>
                    ) : (
                      <Button
                        onClick={handleJoin}
                        loading={actionLoading}
                        disabled={event.status !== 'OPEN'}
                      >
                        {event.status === 'FULL' ? 'Event Full' : 'Join Event'}
                      </Button>
                    )}
                  </div>
                )}

                <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-3">
                  <h4 className="font-semibold text-white">Event details</h4>
                  <p className="text-sm text-slate-200">
                    <strong>Address:</strong> {event.address}
                  </p>
                  <p className="text-sm text-slate-200">
                    <strong>Category:</strong> {event.category}
                  </p>
                  <p className="text-sm text-slate-200">
                    <strong>Min participants:</strong> {event.minParticipants}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={Math.round(Number(event.joiningFee || 0) * 100)}
        eventId={event.id}
        onPaymentSuccess={async (paymentId) => {
          await joinFreeEvent(paymentId);
        }}
      />

      <Footer />
    </div>
  );
}

const SectionCard = ({
  title,
  badgeLabel,
  children,
  id,
}: {
  id?: string;
  title: string;
  badgeLabel?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3" id={id}>
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {badgeLabel && (
        <Badge variant="outline" className="bg-white/5 border-white/10 text-white">
          {badgeLabel}
        </Badge>
      )}
    </div>
    {children}
  </div>
);

const DetailPill = ({ title, value }: { title: string; value: string | number }) => (
  <div className="glass-panel rounded-xl border border-white/10 p-4">
    <p className="text-sm text-slate-300">{title}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </div>
);
