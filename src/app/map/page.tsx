'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import axios from '@/lib/axios';
import { DashboardShell } from '@/components/layout/DashboardShell';
import toast from 'react-hot-toast';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';

const MapContainer = dynamic(
  async () => (await import('react-leaflet')).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, { ssr: false });
const Popup = dynamic(async () => (await import('react-leaflet')).Popup, { ssr: false });

export default function MapPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null);

  const markerIcon = useMemo(() => {
    if (!leaflet) return null;
    return leaflet.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }, [leaflet]);

  useEffect(() => {
    const load = async () => {
      try {
        const lf = await import('leaflet');
        setLeaflet(lf);
        setLoading(true);
        const { data } = await axios.get('/events?limit=50');
        setEvents(data.data || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardShell
      title="Map view"
      subtitle="Browse events by location."
      actions={<Badge variant="outline" className="bg-white/5 border-white/10 text-white">{events.length} events</Badge>}
    >
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {loading || !markerIcon ? (
          <div className="h-[480px] bg-white/5 animate-pulse" />
        ) : (
          <div className="h-[480px]">
            <MapContainer
              center={[40, -95]}
              zoom={4}
              scrollWheelZoom
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {events
                .filter((e) => e.latitude && e.longitude)
                .map((e) => (
                  <Marker key={e.id} position={[Number(e.latitude), Number(e.longitude)] as any} icon={markerIcon as any}>
                    <Popup>
                      <div className="space-y-1">
                        <p className="font-semibold">{e.title}</p>
                        <p className="text-sm">{e.location}</p>
                        <Badge variant="outline">{e.category}</Badge>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        )}
        <div className="p-4 text-sm text-slate-200">
          Tip: zoom and click markers to preview events. Locations fall back to coordinates when available.
        </div>
      </div>
    </DashboardShell>
  );
}
