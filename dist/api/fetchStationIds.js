import { Hono } from 'hono';
import { supabase } from './supabaseClient';
const app = new Hono();
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
    const result = await fetchStationIds(swLatNum, swLngNum, neLatNum, neLngNum);
    if (result.error) {
        return c.json({ error: result.error.message }, 500);
    }
    return c.json(result.data, 200);
});
async function fetchStationIds(sw_lat, sw_lng, ne_lat, ne_lng) {
    // Supabaseからstation_masterテーブルの駅データを取得
    const { data, error } = await supabase
        .from('station_master')
        .select('*')
        .gte('lat', sw_lat)
        .lte('lat', ne_lat)
        .gte('lng', sw_lng)
        .lte('lng', ne_lng);
    return { data, error };
}
export default app;
