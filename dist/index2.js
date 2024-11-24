import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MapComponent from './newmap';
// /newmap エントリーポイントを設定
export default function xyz() {
    const html = ReactDOMServer.renderToString(React.createElement(MapComponent));
    return `<!DOCTYPE html>
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
</html>`;
}
;
