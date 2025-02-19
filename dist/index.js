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
    return c.render(_jsxs("html", { children: [_jsx("script", { type: "text/javascript", src: "https://cdn.jsdelivr.net/npm/simplebar@5.3.6/dist/simplebar.min.js" }), _jsx("link", { href: "/static/newmap.css", rel: "stylesheet" }), _jsxs(Header, { children: [_jsx("div", { id: "map" }), _jsx("div", { class: "content", "data-simplebar": true, "data-simplebar-auto-hide": "false", children: _jsx("div", { id: "omurice-list", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u99C5\u540D" }), _jsx("th", { children: "\u30AA\u30E0\u30E9\u30A4\u30B9\u6307\u6570" })] }) }), _jsx("tbody", { id: "station-list" })] }) }) })] }), _jsx("script", { src: "https://unpkg.com/leaflet/dist/leaflet.js" }), _jsx("script", { src: "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js" }), _jsx("script", { src: "https://unpkg.com/leaflet.locatecontrol/dist/L.Control.Locate.min.js" }), _jsx("script", { src: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js" }), _jsx("script", { src: 'static/main.js', defer: true })] }));
});
// エントリーポイントとしてomuregistを追加
app.get('/omuregist', (c) => {
    return c.render(_jsxs("html", { children: [_jsx("title", { children: "\u30AA\u30E0\u30E9\u30A4\u30B9\u767B\u9332" }), _jsx("script", { type: "text/javascript", src: "https://cdn.jsdelivr.net/npm/simplebar@5.3.6/dist/simplebar.min.js" }), _jsx("link", { rel: "stylesheet", href: "static/style.css" }), _jsx("link", { href: "/static/omuregist.css", rel: "stylesheet" }), _jsx(Header, { children: _jsxs("div", { class: "content", "data-simplebar": true, "data-simplebar-auto-hide": "false", children: [_jsx("header", { children: "\u30AA\u30E0\u30E9\u30A4\u30B9\u767B\u9332" }), _jsxs("main", { children: [_jsxs("form", { id: "uploadForm", method: "post", enctype: "multipart/form-data", children: [_jsxs("div", { class: "text", children: [_jsx("label", { for: "station", children: "\u99C5\u540D:" }), _jsx("input", { type: "text", name: "station", id: "station", required: true })] }), _jsxs("div", { class: "choices", children: [_jsx("p", { children: "\u5375\u306E\u7A2E\u985E\uFF1A" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "egg", value: "5" }), " \u3057\u3063\u304B\u308A\u713C\u3044\u305F\u8584\u713C\u304D\u5375 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "egg", value: "3" }), " \u30D0\u30BF\u30FC\u305F\u3063\u3077\u308A\u3075\u308F\u30C8\u30ED ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "egg", value: "1" }), " \u91CE\u83DC\u306A\u3069\u304C\u5165\u3063\u3066\u3044\u308B ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "egg", value: "0" }), " \u305D\u306E\u4ED6 ", _jsx("br", {})] })] }), _jsxs("div", { class: "choices", children: [_jsx("p", { children: "\u30E9\u30A4\u30B9\u306E\u7A2E\u985E\uFF1A" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "rice", value: "10" }), " \u30C1\u30AD\u30F3\u30E9\u30A4\u30B9 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "rice", value: "5" }), " \u30B1\u30C1\u30E3\u30C3\u30D7\u30E9\u30A4\u30B9 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "rice", value: "2" }), " \u30D4\u30E9\u30D5 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "rice", value: "0" }), " \u767D\u98EF ", _jsx("br", {})] })] }), _jsxs("div", { class: "choices", children: [_jsx("p", { children: "\u30BD\u30FC\u30B9\u306E\u7A2E\u985E\uFF1A" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "sauce", value: "5" }), " \u30B1\u30C1\u30E3\u30C3\u30D7 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "sauce", value: "4" }), " \u30B1\u30C1\u30E3\u30C3\u30D7\u30D9\u30FC\u30B9\u306E\u30BD\u30FC\u30B9 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "sauce", value: "2" }), " \u30C7\u30DF\u30B0\u30E9\u30B9\u30BD\u30FC\u30B9 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "sauce", value: "0" }), " \u305D\u306E\u4ED6 ", _jsx("br", {})] })] }), _jsxs("div", { class: "file-upload", children: [_jsx("label", { for: "file", children: "\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\uFF1A" }), _jsx("input", { type: "file", id: "file", name: "file", accept: "image/*", required: true })] }), _jsx("div", { class: "button-container", children: _jsx("input", { type: "submit", value: "\u9001\u4FE1", class: "button" }) })] }), _jsx("div", { id: "completeMessage", class: "complete-message", children: "\u5B8C\u4E86\u3057\u307E\u3057\u305F " })] }), _jsx("footer", { children: "(c) OmuQuest" })] }) }), _jsx("script", { src: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js" }), _jsx("script", { type: "text/javascript", src: 'static/main.js', defer: true }), _jsx("script", { type: "text/javascript", src: 'static/omuregist.js', defer: true })] }));
});
app.get('/omuregcomplete', (c) => {
    return c.render(_jsxs("html", { children: [_jsx("title", { children: "\u30D5\u30A1\u30A4\u30EB\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9" }), _jsx("link", { rel: "stylesheet", href: "static/style.css" }), _jsx("link", { rel: "stylesheet", href: "static/omuregcomplete.css" }), _jsxs(Header, { children: [_jsx("div", { id: "map" }), _jsxs("div", { class: "content", "data-simplebar": true, "data-simplebar-auto-hide": "false", children: [_jsxs("form", { id: "uploadForm", enctype: "multipart/form-data", children: [_jsx("label", { for: "file", children: "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E:" }), _jsx("input", { type: "file", id: "file", name: "file", required: true }), _jsx("br", {}), _jsx("br", {}), _jsx("button", { type: "submit", children: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9" })] }), _jsx("div", { id: "completeMessage", class: "complete-message", children: "\u5B8C\u4E86\u3057\u307E\u3057\u305F" })] })] }), _jsx("script", { src: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js" }), _jsx("script", { src: 'static/main.js', defer: true }), _jsx("script", { type: "text/javascript", src: 'static/omuregcomplete.js', defer: true })] }));
});
app.get('/station', (c) => {
    const station_id = c.req.query('station_id');
    const station_name = c.req.query('station_name');
    console.log(`/station ${station_id},${station_name}`);
    return c.render(_jsxs("html", { children: [_jsx("meta", { charset: "UTF-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("title", { children: "\u99C5\u5468\u8FBA\u60C5\u5831" }), _jsx("link", { rel: "stylesheet", href: "static/style.css" }), _jsx("link", { rel: "stylesheet", href: "static/station.css" }), _jsxs(Header, { children: [_jsxs("div", { class: "content", "data-simplebar": true, "data-simplebar-auto-hide": "false", children: ["\u4E2D\u76EE\u9ED2\u99C5 ", _jsx("br", {}), "\u30AA\u30E0\u30E9\u30A4\u30B9\u6307\u6570: 33", _jsx("br", {}), _jsx("br", {}), "\u55AB\u8336\u5E97\u306E\u6570: 15\u4EF6", _jsx("br", {}), "\u753A\u4E2D\u83EF\u306E\u6570: 13\u4EF6", _jsx("br", {}), "6: \u4E2D\u76EE\u9ED2\u99C5\u5468\u8FBA\u306B\u306F\u6BD4\u8F03\u7684\u53E4\u3044\u5546\u5E97\u8857\u304C\u5B58\u5728\u3057\u3001\u5C11\u3057\u61D0\u304B\u3057\u3055\u3092\u611F\u3058\u308B\u304C\u3001\u73FE\u4EE3\u7684\u306A\u5E97\u3082\u591A\u3044\u3002", _jsx("br", {}), "7: \u99C5\u5468\u8FBA\u306B\u306F\u7D30\u3044\u9053\u3084\u5165\u308A\u7D44\u3093\u3060\u8DEF\u5730\u304C\u591A\u304F\u3001\u6563\u7B56\u3059\u308B\u3068\u30EC\u30C8\u30ED\u306A\u96F0\u56F2\u6C17\u3092\u5473\u308F\u3048\u308B\u3002", _jsx("br", {}), "4: \u53E4\u304F\u304B\u3089\u306E\u55B6\u696D\u3092\u7D9A\u3051\u308B\u5E97\u306F\u6B8B\u3063\u3066\u3044\u308B\u304C\u3001\u65B0\u3057\u3044\u958B\u767A\u306E\u5F71\u97FF\u3067\u305D\u306E\u6570\u306F\u9650\u3089\u308C\u3066\u3044\u308B\u3002", _jsx("br", {}), "3: \u53E4\u3044\u30B7\u30E7\u30FC\u30B1\u30FC\u30B9\u3084\u98DF\u54C1\u30B5\u30F3\u30D7\u30EB\u3092\u98FE\u3063\u3066\u3044\u308B\u5E97\u306F\u5C11\u306A\u304F\u3001\u5168\u4F53\u7684\u306B\u30E2\u30C0\u30F3\u306A\u5370\u8C61\u304C\u5F37\u3044\u3002", _jsx("br", {})] }), _jsxs("div", { class: "input-window", "data-simplebar": true, "data-simplebar-auto-hide": "false", children: [_jsxs("div", { class: "title-bar", children: [_jsx("span", { class: "title", children: "\u60C5\u5831\u767B\u9332" }), _jsxs("div", { class: "buttons", children: [_jsx("button", { class: "minimize", children: "-" }), _jsx("button", { class: "close", children: "x" })] })] }), _jsx("div", { class: "contentb", "data-simplebar": true, "data-simplebar-auto-hide": "false", children: _jsxs("form", { id: "uploadForm", method: "post", enctype: "multipart/form-data", children: [_jsxs("div", { class: "text", children: [_jsx("label", { for: "station", children: "\u99C5\u540D" }), _jsx("input", { type: "text", name: "station", id: "station", value: "", required: true })] }), _jsxs("fieldset", { class: "choices", children: [_jsx("legend", { children: "\u5546\u5E97\u8857\u306E\u69D8\u5B50" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "shoutengai", value: "10" }), " \u30A2\u30FC\u30B1\u30FC\u30C9\u306E\u3042\u308B\u6614\u306A\u304C\u3089\u306E\u5546\u5E97\u8857\u304C\u3042\u308A\u3001\u6D3B\u6CC1\u3067\u3042\u308B ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "shoutengai", value: "5" }), " \u5546\u5E97\u8857\u306F\u3042\u308B\u304C\u3001\u30B7\u30E3\u30C3\u30BF\u30FC\u304C\u9589\u307E\u3063\u3066\u3044\u308B\u5E97\u304C\u3061\u3089\u307B\u3089 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "shoutengai", value: "0" }), " \u5546\u5E97\u8857\u304C\u898B\u5F53\u305F\u3089\u306A\u3044 ", _jsx("br", {})] })] }), _jsxs("fieldset", { class: "choices", children: [_jsx("legend", { children: "\u5468\u8FBA\u9053\u8DEF\u306E\u69D8\u5B50" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "michi", value: "10" }), " \u7D30\u3044\u8DEF\u5730\u304C\u3042\u3061\u3053\u3061\u306B\u3042\u308A\u3001\u753A\u306E\u5965\u884C\u304D\u3092\u611F\u3058\u308B ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "michi", value: "5" }), " \u9053\u306F\u5C11\u306A\u3044\u304C\u6574\u5099\u3055\u308C\u3066\u3044\u306A\u3044 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "michi", value: "0" }), " \u304D\u308C\u3044\u306B\u533A\u753B\u6574\u7406\u3055\u308C\u3066\u3044\u308B\u3002 ", _jsx("br", {})] })] }), _jsxs("fieldset", { class: "choices", children: [_jsx("legend", { children: "\u53E4\u3044\u5E97\u304C\u6B8B\u3063\u3066\u3044\u308B\u304B" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "furuiMise", value: "10" }), " \u6614\u304B\u3089\u3084\u3063\u3066\u3044\u308B\u3068\u601D\u308F\u308C\u308B\u5E97\u304C\u591A\u304F\u898B\u3089\u308C\u308B ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "furuiMise", value: "5" }), " \u518D\u958B\u767A\u304C\u9032\u3093\u3067\u304A\u308A\u3001\u30D3\u30EB\u306B\u5165\u3063\u3066\u3044\u308B\u5E97\u304C\u591A\u3044 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "furuiMise", value: "0" }), " \u30C1\u30A7\u30FC\u30F3\u5E97\u306E\u3088\u3046\u306A\u5E97\u304C\u5927\u534A\u3067\u3042\u308B ", _jsx("br", {})] })] }), _jsxs("fieldset", { class: "choices", children: [_jsx("legend", { children: "\u30B7\u30E7\u30FC\u30B1\u30FC\u30B9\u3084\u98DF\u54C1\u30B5\u30F3\u30D7\u30EB" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "shokuSample", value: "10" }), " \u30B7\u30E7\u30FC\u30B1\u30FC\u30B9\u306E\u4E2D\u306B\u98DF\u54C1\u30B5\u30F3\u30D7\u30EB\u3092\u7F6E\u3044\u3066\u3044\u308B\u5E97\u304C\u3042\u308B ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "shokuSample", value: "5" }), " \u30B7\u30E7\u30FC\u30B1\u30FC\u30B9\u306F\u7121\u3044\u304C\u3001\u5199\u771F\u3084\u30E1\u30CB\u30E5\u30FC\u3092\u51FA\u3057\u3066\u3044\u308B\u5E97\u304C\u3042\u308B ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "shokuSample", value: "2" }), " \u30E9\u30F3\u30C1\u6642\u306E\u6848\u5185\u7A0B\u5EA6 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "shokuSample", value: "0" }), " \u8868\u304B\u3089\u306F\u3042\u307E\u308A\u3088\u304F\u5206\u304B\u3089\u306A\u3044 ", _jsx("br", {})] })] }), _jsxs("fieldset", { class: "choices", children: [_jsx("legend", { children: "\u53E4\u3044\u98F2\u98DF\u30D3\u30EB\u304C\u3042\u308B\u304B\u3069\u3046\u304B" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "building", value: "10" }), " \u6614\u304B\u3089\u3042\u308B\u53E4\u3044\u98F2\u98DF\u30D3\u30EB\u304C\u4F55\u8ED2\u3082\u3042\u308A\u3001\u663C\u9593\u3067\u3082\u55B6\u696D\u3057\u3066\u3044\u308B ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "building", value: "5" }), " \u53E4\u3044\u98F2\u98DF\u30D3\u30EB\u306F\u3042\u308B\u304C\u3001\u663C\u9593\u306F\u55B6\u696D\u3057\u3066\u3044\u306A\u3044\u5E97\u304C\u5927\u534A ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "building", value: "2" }), " \u98F2\u98DF\u30D3\u30EB\u306F\u3042\u308B\u304C\u3001\u5927\u534A\u304C\u65B0\u3057\u3044\u30D3\u30EB\u3067\u53E4\u3044\u5E97\u306F\u898B\u5F53\u305F\u3089\u306A\u3044 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "building", value: "0" }), " \u98F2\u98DF\u30D3\u30EB\u306F\u5168\u304F\u898B\u5F53\u305F\u3089\u306A\u3044 ", _jsx("br", {})] })] }), _jsxs("fieldset", { class: "choices", children: [_jsx("legend", { children: "\u30C1\u30A7\u30FC\u30F3\u5E97\u304C\u5C11\u306A\u3044\u304B\u3069\u3046\u304B" }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "chain", value: "10" }), " \u30C1\u30A7\u30FC\u30F3\u5E97\u3067\u306F\u306A\u3044\u30ED\u30FC\u30AB\u30EB\u306E\u5E97\u304C\u5927\u534A ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "chain", value: "7" }), " \u30C1\u30A7\u30FC\u30F3\u5E97\u304C\u3061\u3089\u307B\u3089\u3042\u308B\u304C\u3001\u30ED\u30FC\u30AB\u30EB\u306E\u5E97\u304C\u591A\u3044 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "chain", value: "5" }), " \u30C1\u30A7\u30FC\u30F3\u5E97\u304C\u591A\u304F\u3042\u308B\u304C\u3001\u30ED\u30FC\u30AB\u30EB\u306E\u5E97\u3082\u591A\u3044 ", _jsx("br", {})] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "chain", value: "2" }), " \u5927\u534A\u304C\u30C1\u30A7\u30FC\u30F3\u5E97\u306E\u3088\u3046\u306B\u898B\u3048\u308B ", _jsx("br", {})] })] }), _jsxs("div", { class: "file-upload", children: [_jsx("label", { for: "file", children: "\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\uFF1A" }), _jsx("input", { type: "file", id: "file", name: "file", accept: "image/*" })] }), _jsx("div", { class: "button-container", children: _jsx("input", { type: "submit", value: "\u9001\u4FE1", class: "button" }) })] }) }), _jsx("footer", { children: "(c) OmuQuest" })] })] }), _jsx("script", { src: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js" }), _jsx("script", { src: 'static/main.js', defer: true }), _jsx("script", { type: "text/javascript", src: 'static/station.js', defer: true })] }));
});
// 以下は関数
app.get('/getEnv', (c) => {
    const result = {
        supabaseUrl: c.env.SUPABASE_API_URL,
        supabaseKey: c.env.SUPABASE_API_KEY
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
    const keys = {
        openaiApiKey: c.env.OPENAI_API_KEY,
        googleApiKey: c.env.GOOGLE_API_KEY,
        gyazoApiKey: c.env.GYAZO_ACCESS_TOKEN,
    };
    try {
        const result = await getOmuIndexByID(keys, station_id);
        console.log(result);
        return c.json(result);
    }
    catch (error) {
        console.error('Error fetching Omu Index by ID:', error);
        return c.json({ error: 'Failed to fetch Omu Index' }, 500);
    }
});
// データアップロード
// バリデーションスキーマ定義
import { z } from 'zod';
import { uploadImage } from './api/script';
const uploadSchema = z.object({
    station: z.string(),
    shoutengai: z.string().nullable(),
    michi: z.string().nullable(),
    furui_mise: z.string().nullable(),
    shoku_sample: z.string().nullable(),
    building: z.string().nullable(),
    chain: z.string().nullable(),
    userLat: z.number(),
    userLng: z.number(),
    fileName: z.string(),
    image: z.string(), // Base64エンコードされた画像データ
});
app.post('/uploadStation', async (c) => {
    try {
        // リクエストのJSONを取得
        const body = await c.req.json();
        // バリデーション
        const validatedData = uploadSchema.parse(body);
        // ここでデータの保存処理を行う (例: DB に登録, 画像をCloudflare R2などに保存)
        // console.log('受信データ:', validatedData);
        // imageファイルのアップロード
        const imageUrl = uploadImage(c.env.GYAZO_ACCESS_TOKEN, validatedData.image, validatedData.fileName);
        if (imageUrl == null) {
            return c.json({ message: 'Image file upload error' }, 400);
        }
        console.log('URL: ', imageUrl);
        // DBへの登録
        const stationId = await accesslib.getStationId(validatedData.station, validatedData.userLat, validatedData.userLng);
        const openaiId = await accesslib.insertOpenAIInfo(stationId, validatedData.shoutengai, validatedData.michi, validatedData.furui_mise, validatedData.shoku_sample, validatedData.building, validatedData.chain);
        // レスポンスを返す
        return c.json({ message: 'Upload successful', data: validatedData }, 200);
    }
    catch (error) {
        console.error('Upload Error:', error);
        if (error instanceof Error) {
            return c.json({ message: 'Invalid request', error: error.message }, 400);
        }
        else {
            return c.json({ message: 'Invalid request' }, 400);
        }
    }
});
const uploadOmuriceSchema = z.object({
    station: z.string(),
    egg: z.number(),
    rice: z.number(),
    sauce: z.number(),
    userLat: z.number(),
    userLng: z.number(),
    fileName: z.string(),
    image: z.string(), // Base64エンコードされた画像データ
});
app.post('/uploadOmurice', async (c) => {
    try {
        // リクエストのJSONを取得
        const body = await c.req.json();
        // バリデーション
        const validatedData = uploadOmuriceSchema.parse(body);
        // ここでデータの保存処理を行う (例: DB に登録, 画像をCloudflare R2などに保存)
        // console.log('受信データ:', validatedData);
        // imageファイルのアップロード
        const imageUrl = await uploadImage(c.env.GYAZO_ACCESS_TOKEN, validatedData.image, validatedData.fileName);
        if (imageUrl == null) {
            return c.json({ message: 'Image file upload error' }, 400);
        }
        console.log('URL: ', imageUrl);
        // DBへの登録
        const stationId = await accesslib.getStationId(validatedData.station, validatedData.userLat, validatedData.userLng);
        const openaiId = await accesslib.registerOmurice(validatedData.station, stationId, validatedData.egg, validatedData.rice, validatedData.sauce, imageUrl);
        // レスポンスを返す
        return c.json({ message: 'Upload successful', data: validatedData }, 200);
    }
    catch (error) {
        console.error('Upload Error:', error);
        if (error instanceof Error) {
            return c.json({ message: 'Invalid request', error: error.message }, 400);
        }
        else {
            return c.json({ message: 'Invalid request' }, 400);
        }
    }
});
export default app;
