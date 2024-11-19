import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { Hono } from 'hono';
import { renderer } from './renderer';
import Header from './components/Header';
const app = new Hono();
app.use(renderer);
// ルートパスでtopmenu.htmlにリダイレクト
app.get('/', (c) => {
    return c.redirect('/static/topmenu.html');
});
// エントリーポイントとしてnewmapを追加
app.get('/newmap', (c) => {
    return c.render(_jsx("html", { children: _jsxs(Header, { children: [_jsx("div", { id: "map" }), _jsx("div", { class: "content", "data-simplebar": true, "data-simplebar-auto-hide": "false", children: _jsx("div", { id: "omurice-list", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u99C5\u540D" }), _jsx("th", { children: "\u30AA\u30E0\u30E9\u30A4\u30B9\u6307\u6570" })] }) }), _jsx("tbody", { id: "station-list" })] }) }) }), _jsx("script", { src: "https://unpkg.com/leaflet/dist/leaflet.js" }), _jsx("script", { src: "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js" }), _jsx("script", { src: "https://unpkg.com/leaflet.locatecontrol/dist/L.Control.Locate.min.js" }), _jsx("script", { src: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js" }), _jsx("script", { src: 'static/main.js', defer: true })] }) }));
});
import ReactDOMServer from 'react-dom/server';
import MapComponent from './newmap';
import { getEnvironmentData } from 'worker_threads';
// /newmap エントリーポイントを設定
app.get('/newmap2', (c) => {
    const html = ReactDOMServer.renderToString(_jsx(MapComponent, {}));
    return c.html(`<!DOCTYPE html>
<html>
  <head>
    <title>Map Page</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  </head>
  <body>
    <div id="root">${html}</div>
    <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
    <script src="/main.js"></script>
  </body>
</html>`);
});
app.get('/getEnv', (c) => {
    const result = {
        supabaseUrl: getEnvironmentData('SUPERBASE_API_URL'),
        supabaseKey: getEnvironmentData('SUPABASE_API_KEY')
    };
    return c.json(result, 200);
});
function toInt(param) {
    return param ? parseInt(param, 10) : undefined;
}
function toFloat(param) {
    return param ? parseFloat(param) : undefined;
}
import * as accesslib from './api/accesslib';
app.get('/fetchOmuIndexData', async (c) => {
    // クエリパラメータを取得
    const station_name = c.req.query('station_name');
    const station_id = toInt(c.req.query('station_id'));
    const lat = toFloat(c.req.query('lat'));
    const lng = toFloat(c.req.query('lng'));
    if (!station_name || !station_id || !lat || !lng) {
        return c.json({ error: 'Missing required query parameters' }, 400);
    }
    // fetchOmuriceIndexData を呼び出し
    let result = await accesslib.fetchOmuriceIndexData(station_name, station_id, lat, lng);
    if (!result) {
        result = {
            index: 0,
            stationName: station_name,
            station_id,
            lat,
            lng
        };
    }
    return c.json(result, 200);
});
app.get('/fetchStationIds', async (c) => {
    // クエリパラメータを取得
    const sw_lat = c.req.query('sw_lat');
    const sw_lng = c.req.query('sw_lng');
    const ne_lat = c.req.query('ne_lat');
    const ne_lng = c.req.query('ne_lng');
    // パラメータの型チェックと変換
    if (!sw_lat || !sw_lng || !ne_lat || !ne_lng) {
        return c.json({ error: 'Missing required query parameters' }, 400);
    }
    const swLatNum = parseFloat(sw_lat);
    const swLngNum = parseFloat(sw_lng);
    const neLatNum = parseFloat(ne_lat);
    const neLngNum = parseFloat(ne_lng);
    if (isNaN(swLatNum) || isNaN(swLngNum) || isNaN(neLatNum) || isNaN(neLngNum)) {
        return c.json({ error: 'Invalid query parameter values' }, 400);
    }
    // Supabase から駅データを取得
    const result = await accesslib.fetchStationIds(swLatNum, swLngNum, neLatNum, neLngNum);
    if (!result) {
        return c.json({ error: "fetchStationIds Error" }, 500);
    }
    return c.json(result, 200);
});
import { getOmuIndexByID } from './api/script';
app.get('/getOmuIndexByID', async (c) => {
    // クエリパラメータを取得
    const station_id = c.req.query('station_id');
    if (!station_id) {
        return c.json({ error: 'Missing station_id' }, 400);
    }
    try {
        const result = await getOmuIndexByID(station_id);
        console.log(result);
        return c.json(result);
    }
    catch (error) {
        console.error('Error fetching Omu Index by ID:', error);
        return c.json({ error: 'Failed to fetch Omu Index' }, 500);
    }
});
export default app;
