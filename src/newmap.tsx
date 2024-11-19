import React, { useEffect } from 'react';
import L from 'leaflet'; // Leafletライブラリをインポート
import { getUserLocation, saveLocation, useSavedLocation } from './main';

const MapComponent = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        const location = await getUserLocation();
        saveLocation(location.lat, location.lng, 13);

        // 地図を初期化して描画する
        const map = L.map('map').setView([location.lat, location.lng], 13);

        // OSM（OpenStreetMap）タイルレイヤーを追加する
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      } catch (error) {
        console.error('位置情報の取得に失敗しました:', error);
      }
    };

    initialize();
    useSavedLocation();
  }, []);

  return (
    <div id="map" style={{ height: '500px', width: '100%' }}>
      {/* LeafletマップをレンダリングするDOM要素 */}
    </div>
  );
};

export default MapComponent;

