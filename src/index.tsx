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
  return c.render(
    <html>
    <Header>
    <div id="map"></div>
    <div class="content" data-simplebar data-simplebar-auto-hide="false">
      <div id="omurice-list">
      <table>
        <thead>
          <tr>
            <th>駅名</th>
            <th>オムライス指数</th>
          </tr>
        </thead>
        <tbody id="station-list">
        </tbody>
      </table>
      </div>
    </div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script src="https://unpkg.com/leaflet.locatecontrol/dist/L.Control.Locate.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
    <script src='static/main.js' defer></script>
    </Header>
    </html>
  );
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import { serve } from '@hono/node-server';
import ReactDOMServer from 'react-dom/server';
import MapComponent from './newmap';
import { getEnvironmentData } from 'worker_threads';

// /newmap エントリーポイントを設定
app.get('/newmap2', (c) => {
  const html = ReactDOMServer.renderToString(<MapComponent />);
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
  }
  return c.json(result,200);
});

function toInt(param: string|undefined): number|undefined {
  return param?parseInt(param,10):undefined;
}
function toFloat(param: string|undefined): number|undefined {
  return param?parseFloat(param):undefined;
}

import type { StationData,OmuriceIndexHeader,OmuriceIndexData } from './api/types';
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
  let result: OmuriceIndexHeader | null = await accesslib.fetchOmuriceIndexData(station_name, station_id, lat, lng);
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
  const result:StationData[]|null = await accesslib.fetchStationIds(swLatNum, swLngNum, neLatNum, neLngNum);

  if ( !result ) {
    return c.json({ error: "fetchStationIds Error" }, 500);
  }

  return c.json(result, 200);
});

import { getOmuIndexByID } from './api/script'

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
  } catch (error) {
    console.error('Error fetching Omu Index by ID:', error);
    return c.json({ error: 'Failed to fetch Omu Index' }, 500);
  }
});


export default app;
