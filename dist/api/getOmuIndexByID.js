import { Hono } from 'hono';
import { getOmuIndexByID } from './script';
const app = new Hono();
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
