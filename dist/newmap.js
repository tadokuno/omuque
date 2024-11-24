import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'simplebar/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';
import { createClient } from '@supabase/supabase-js';
import './newmap.css';
const Header = ({ children }) => {
    return (_jsxs("div", { className: "window", children: [_jsxs("div", { className: "title-bar", children: [_jsx("span", { className: "title", children: "OmuQue Manager" }), _jsxs("div", { className: "buttons", children: [_jsx("button", { className: "minimize", children: "-" }), _jsx("a", { href: "/static/topmenu.html", children: _jsx("button", { id: "close", className: "close", children: "x" }) })] })] }), children] }));
};
const NewMap = () => {
    const [map, setMap] = useState(null);
    const [supabaseClient, setSupabaseClient] = useState(null);
    const [stations, setStations] = useState([]);
    useEffect(() => {
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
        setSupabaseClient(createClient(supabaseUrl, supabaseKey));
        const tokyoLat = 35.681236;
        const tokyoLng = 139.767125;
        const lat = getCookie('latitude');
        const lng = getCookie('longitude');
        const zoom = getCookie('zoom');
        if (lat && lng && zoom) {
            initializeMap(lat, lng, zoom);
        }
        else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                initializeMap(position.coords.latitude, position.coords.longitude, 13);
            }, () => {
                initializeMap(tokyoLat, tokyoLng, 13);
            });
        }
        else {
            initializeMap(tokyoLat, tokyoLng, 13);
        }
    }, []);
    const initializeMap = (lat, lng, zoom) => {
        const newMap = L.map('map').setView([lat, lng], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(newMap);
        newMap.on('moveend', fetchStationData);
        newMap.on('resize', fetchStationData);
        setMap(newMap);
    };
    const fetchStationData = async () => {
        if (!map || !supabaseClient)
            return;
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const center = map.getCenter();
        const zoom = map.getZoom();
        saveLocation(center.lat, center.lng, zoom);
        const { data, error } = await supabaseClient
            .from('station_master')
            .select('*')
            .gte('lat', sw.lat)
            .lte('lat', ne.lat)
            .gte('lng', sw.lng)
            .lte('lng', ne.lng);
        if (error) {
            console.error('Error fetching station data:', error);
            return;
        }
        for (const station of data) {
            const result = await fetchOmuIndexData(station.station_name, station.station_id, station.lat, station.lng);
            station.index = result?.index || 0;
        }
        data.sort((a, b) => b.index - a.index);
        setStations(data);
        updateMapMarkers(data);
    };
    const updateMapMarkers = (stations) => {
        if (!map)
            return;
        stations.forEach((station) => {
            const marker = L.marker([station.lat, station.lng]).addTo(map);
            marker.bindPopup(`<b>${station.station_name}</b><br>オムライス指数: ${station.index}`);
        });
    };
    const fetchOmuIndexData = async (station_name, station_id, lat, lng) => {
        try {
            const response = await fetch(`/fetchOmuIndexData?station_name=${station_name}&station_id=${station_id}&lat=${lat}&lng=${lng}`);
            return await response.json();
        }
        catch (error) {
            console.error('Error fetching Omu Index data:', error);
            return null;
        }
    };
    return (_jsx("div", { children: _jsxs(Header, { children: [_jsx("div", { id: "map", style: { height: '500px' } }), _jsx(SimpleBar, { className: "content", "data-simplebar-auto-hide": "false", children: _jsx("div", { id: "omurice-list", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u99C5\u540D" }), _jsx("th", { children: "\u30AA\u30E0\u30E9\u30A4\u30B9\u6307\u6570" })] }) }), _jsx("tbody", { children: stations.map((station) => (_jsxs("tr", { onClick: () => window.location.href = `station.html?station_id=${station.station_id}`, children: [_jsx("td", { children: station.station_name }), _jsx("td", { children: station.index })] }, station.station_id))) })] }) }) })] }) }));
};
// Helper functions for cookies
const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
};
const getCookie = (name) => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
};
const saveLocation = (lat, lng, zoom) => {
    setCookie('latitude', lat, 7);
    setCookie('longitude', lng, 7);
    setCookie('zoom', zoom, 7);
    console.log(`位置情報を保存しました: 緯度 ${lat}, 経度 ${lng}`);
};
export default NewMap;
