'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { EventForm } from '@/components/events/EventForm';
import { Event } from '@/types';
import { z } from 'zod';
import { eventSchema } from '@/lib/validators';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function EditEventPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (params.id) {
            fetchEvent();
        }
    }, [params.id, authLoading]);

    const fetchEvent = async () => {
        try {
            const { data } = await axios.get(`/events/${params.id}`);
            setEvent(data.data);
        } catch (error: any) {
            toast.error('Failed to load event');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values: z.infer<typeof eventSchema>) => {
        if (!event) return;
        try {
            await axios.patch(`/events/${event.id}`, values);
            toast.success('Event updated');
            router.push(`/events/${event.id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update event');
        }
    };

    const isAuthorized = event && user && (user.role === 'ADMIN' || user.id === event.hostId);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950">
                <DashboardShell title="Loading event..." subtitle="" actions={null}>
                    <div className="h-64 glass-panel rounded-2xl bg-white/5 animate-pulse" />
                </DashboardShell>
            </div>
        );
    }

    if (!event || !isAuthorized) {
        return (
            <DashboardShell title="Not authorized" subtitle="You cannot edit this event." actions={null}>
                <div className="h-32 glass-panel rounded-2xl border border-white/10" />
            </DashboardShell>
        );
    }

    return (
        <DashboardShell title="Edit event" subtitle="Update event information" actions={null}>
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <EventForm
                    initialData={event}
                    onSubmit={handleUpdate}
                    submitLabel="Save changes"
                    allowStatusChange
                />
            </div>
        </DashboardShell>
    );
}
