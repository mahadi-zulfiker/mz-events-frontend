'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { EventForm } from '@/components/events/EventForm';
import { z } from 'zod';
import { eventSchema } from '@/lib/validators';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function CreateEventPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;
        if (user && user.role !== 'HOST' && user.role !== 'ADMIN') {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const handleCreate = async (values: z.infer<typeof eventSchema>) => {
        try {
            await axios.post('/events', values);
            toast.success('Event created successfully');
            router.push('/events');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <DashboardShell
            title="Launch a new experience"
            subtitle="Craft the essentials and publish instantly."
            actions={null}
        >
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <EventForm onSubmit={handleCreate} submitLabel="Create Event" />
            </div>
        </DashboardShell>
    );
}
