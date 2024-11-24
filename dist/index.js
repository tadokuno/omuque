import { Hono } from 'hono';
import { renderer } from './renderer';
const app = new Hono();
app.use(renderer);
// ルートパスでtopmenu.htmlにリダイレクト
app.get('/', (c) => {
    return c.redirect('/static/topmenu.html');
});
export default app;
