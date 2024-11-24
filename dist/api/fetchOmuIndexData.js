import { Hono } from 'hono';
import { fetchOmuriceIndexData } from './regOmuIndex';
const app = new Hono();
function toInt(param) {
    return param ? parseInt(param, 10) : undefined;
}
function toFloat(param) {
    return param ? parseFloat(param) : undefined;
}
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
    let result = await fetchOmuriceIndexData(station_name, station_id, lat, lng);
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
export default app;
