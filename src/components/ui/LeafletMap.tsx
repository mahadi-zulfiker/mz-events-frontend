'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapProps {
    center: [number, number];
    zoom?: number;
    markers?: Array<{
        id: string;
        position: [number, number];
        popup?: React.ReactNode;
    }>;
    className?: string;
    style?: React.CSSProperties;
}

const LeafletMap = ({ center, zoom = 13, markers = [], className, style }: MapProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-full w-full bg-slate-900/10 animate-pulse rounded-xl" />;
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            className={className}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', ...style }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position} icon={icon}>
                    {marker.popup && <Popup>{marker.popup}</Popup>}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LeafletMap;
