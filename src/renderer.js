import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { jsxRenderer } from 'hono/jsx-renderer';
export const renderer = jsxRenderer(({ children }) => {
    return (_jsxs("html", { lang: "ja", children: [_jsxs("head", { children: [_jsx("meta", { charset: "UTF-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("link", { rel: "stylesheet", href: "https://unpkg.com/leaflet/dist/leaflet.css" }), _jsx("link", { rel: "stylesheet", href: "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" }), _jsx("link", { rel: "stylesheet", href: "https://unpkg.com/leaflet.locatecontrol/dist/L.Control.Locate.min.css" }), _jsx("link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/simplebar@5.3.6/dist/simplebar.min.css" }), _jsx("script", { type: "text/javascript", src: "https://cdn.jsdelivr.net/npm/simplebar@5.3.6/dist/simplebar.min.js" })] }), _jsx("body", { children: children })] }));
});
