'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from '@/lib/axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FiMapPin, FiClock, FiDollarSign, FiSearch, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(async () => (await import('react-leaflet')).MapContainer, { ssr: false });
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });
const Popup = dynamic(async () => (await import('react-leaflet')).Popup, { ssr: false });

const statusColor = {
  OPEN: 'bg-emerald-100 text-emerald-800',
  FULL: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const categoryOptions = [
  'CONCERT',
  'SPORTS',
  'GAMING',
  'FOOD',
  'TECH',
  'ART',
  'TRAVEL',
  'OTHER',
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0 });
  const [mapReady, setMapReady] = useState(false);
  const defaultCenter: [number, number] = [40, -95];
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    status: '',
    category: '',
    minFee: '',
    maxFee: '',
    date: '',
  });
  const activeFilters = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  useEffect(() => {
    fetchEvents();
  }, [filters, meta.page]);

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

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('limit', String(meta.limit));
      params.append('page', String(meta.page));
      const response = await axios.get(`/events?${params.toString()}`);
      setEvents(response.data.data);
      if (response.data.meta) {
        setMeta(response.data.meta);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      status: '',
      category: '',
      minFee: '',
      maxFee: '',
      date: '',
    });
    setMeta((p) => ({ ...p, page: 1 }));
  };

  const totalPages = Math.max(1, Math.ceil((meta.total || 1) / meta.limit));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
            <FiFilter /> curated for you
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Discover experiences built around your interests
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl">
            Search, filter, and join events with polished cards, clear availability, and payment-ready flows.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="glass-panel rounded-2xl border border-white/10 p-5 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Filters</p>
              <p className="text-sm text-slate-200">
                {activeFilters} active filter{activeFilters === 1 ? '' : 's'}
              </p>
            </div>
            {activeFilters > 0 && (
              <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-slate-100">
                Active
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                className="pl-10 border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              />
            </div>

            <Input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
            />

            <Select
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
              className="border-white/10 bg-white/5 text-white"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
              className="border-white/10 bg-white/5 text-white"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="FULL">Full</option>
              <option value="COMPLETED">Completed</option>
            </Select>

            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
            />

            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                placeholder="Min fee"
                value={filters.minFee}
                onChange={(e) => setFilters((p) => ({ ...p, minFee: e.target.value }))}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              />
              <Input
                type="number"
                min={0}
                placeholder="Max fee"
                value={filters.maxFee}
                onChange={(e) => setFilters((p) => ({ ...p, maxFee: e.target.value }))}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={clearFilters} className="text-slate-100">
              Clear
            </Button>
            <Button onClick={fetchEvents}>Search</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="h-72 glass-panel rounded-2xl animate-pulse bg-white/5" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 text-center text-slate-200 border border-dashed border-white/20">
                <p className="text-2xl font-semibold">No events found</p>
                <p className="text-sm text-slate-400 mt-2">Adjust your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => {
                    const participantCount = event._count?.participants ?? 0;
                    const fee = Number(event.joiningFee || 0);
                    const cover =
                      event.imageUrl ||
                      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80';

                    return (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-indigo-900/40 transition hover:-translate-y-2"
                      >
                        <div
                          className="h-40 bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${cover})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <Badge className={cn(statusColor[event.status] || 'bg-gray-100 text-gray-700')}>
                              {event.status}
                            </Badge>
                            <span className="text-xs text-white opacity-80">
                              {participantCount}/{event.maxParticipants} joined
                            </span>
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="bg-white/10 border-white/10 text-white">
                              {event.category}
                            </Badge>
                            <span className="text-xs text-slate-300">
                              Host: {event.host.fullName.split(' ')[0]}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-white line-clamp-2">{event.title}</h3>
                          <p className="text-sm text-slate-200 line-clamp-2">{event.description}</p>
                          <div className="space-y-2 text-sm text-slate-200">
                            <div className="flex items-center gap-2">
                              <FiClock className="text-indigo-300" />
                              <span>{`${format(new Date(event.date), 'PPP')} at ${event.time}`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiMapPin className="text-indigo-300" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiDollarSign className="text-indigo-300" />
                              <span>{fee === 0 ? 'Free' : `$${fee}`}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                              {event.host.fullName.charAt(0)}
                            </div>
                            <span className="text-sm text-slate-200">Hosted by {event.host.fullName}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    disabled={meta.page <= 1}
                    onClick={() => setMeta((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  >
                    Previous
                  </Button>
                  <p className="text-sm text-slate-300">
                    Page {meta.page} of {totalPages}
                  </p>
                  <Button
                    variant="outline"
                    disabled={meta.page >= totalPages}
                    onClick={() => setMeta((p) => ({ ...p, page: Math.min(totalPages, p.page + 1) }))}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 p-4 h-full space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Live map</p>
              <Badge variant="outline" className="bg-white/5 border-white/10 text-white">
                {events.length} events
              </Badge>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
              {!mapReady ? (
                <div className="h-72 animate-pulse bg-white/5" />
              ) : (
                <div className="h-72">
                  <MapContainer center={defaultCenter} zoom={3} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {events
                      .filter((e) => e.latitude && e.longitude)
                      .map((e) => (
                        <Marker key={e.id} position={[Number(e.latitude), Number(e.longitude)] as any}>
                          <Popup>
                            <div className="space-y-1">
                              <p className="font-semibold">{e.title}</p>
                              <p className="text-xs text-slate-500">{e.location}</p>
                              <Badge variant="outline">{e.category}</Badge>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-300">
              Quick glance of events with location data. Use the dedicated map page for full-screen filtering.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
