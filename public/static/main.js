// ユーザーの現在位置を取得（Geolocation APIを使用）
const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            // GPS情報を取得する
            navigator.geolocation.getCurrentPosition(
                (position) => resolve({
                    lat: position.coords.latitude,   // 緯度
                    lng: position.coords.longitude   // 経度
                }),
                (error) => {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("ユーザーが位置情報取得を拒否しました。");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("位置情報を取得できませんでした。");
                            break;
                        case error.TIMEOUT:
                            console.error("位置情報取得のリクエストがタイムアウトしました。");
                            break;
                        default:
                            console.error("未知のエラーが発生しました。");
                            break;
                    }
                },
                {
                    enableHighAccuracy: true,        // 高精度の位置情報を取得
                    timeout: 10000,                  // 10秒以内に取得できなければ失敗
                    maximumAge: 0                    // キャッシュされた位置情報は使わない
                }
            );
        } else {
            reject(new Error("Geolocationはサポートされていません"));
        }
    });
};

// クッキーを設定する関数
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// クッキーを取得する関数
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 位置情報を保存する関数
function saveLocation(lat,lng,zoom) {
    setCookie('latitude', lat, 7);  // 緯度を7日間保存
    setCookie('longitude', lng, 7); // 経度を7日間保存
    setCookie('zoom', zoom, 7);
    console.log(`位置情報を保存しました: 緯度 ${lat}, 経度 ${lng}`);
}

function saveLocationToCookie(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    setCookie('latitude', lat, 7);  // 緯度を7日間保存
    setCookie('longitude', lng, 7); // 経度を7日間保存
    console.log(`位置情報を保存しました: 緯度 ${lat}, 経度 ${lng}`);
}

// 位置情報の取得
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveLocationToCookie, showError);
    } else {
        console.error("このブラウザは位置情報取得をサポートしていません。");
    }
}

// エラーが発生した場合の処理
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.error("ユーザーが位置情報の取得を拒否しました。");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("位置情報が利用できません。");
            break;
        case error.TIMEOUT:
            console.error("位置情報の取得がタイムアウトしました。");
            break;
        case error.UNKNOWN_ERROR:
            console.error("未知のエラーが発生しました。");
            break;
    }
}

// 保存された位置情報を利用する関数
function useSavedLocation() {
    const lat = getCookie('latitude');
    const lng = getCookie('longitude');
    if (lat && lng) {
        console.log(`保存された位置情報を利用: 緯度 ${lat}, 経度 ${lng}`);
        // ここで地図や他の機能に緯度経度を利用できます
    } else {
        console.log("保存された位置情報はありません。");
    }
}

  let map;
  let markerGroup;
  let supabaseClient;

  // Leafletマップの初期化
  async function initializeMap(lat, lng, zoom) {
    map = L.map('map').setView([lat, lng], zoom);  /* zoom 率 13 */

    // OpenStreetMapのタイルレイヤーを追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 検索ウィジェットの追加 (Leaflet Control Geocoder)
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true
    }).addTo(map);

    // 現在位置に移動するウィジェットの追加 (Leaflet Locate Control)
    L.control.locate({
      position: 'topright',
      keepCurrentZoomLevel: true,
      strings: {
          title: "現在位置を表示"
      }
    }).addTo(map);

    // 地図が移動したりリサイズされたときに駅リストを更新
    map.on('moveend', fetchStationData);   // 地図の位置が変更されたとき
    map.on('resize', fetchStationData);    // 地図がリサイズされたとき
    // 駅データを取得してマップに表示
    await fetchStationData();
  }

  async function initMap() {
    const response = await fetch('/.netlify/functions/getEnv');  // サーバーレス関数を呼び出す
    const env = await response.json();
    supabaseClient = supabase.createClient(env.supabaseUrl, env.supabaseKey);

    // 東京駅をデフォルトとして、現在地を中心に設定
    const tokyo_lat = 35.681236;
    const tokyo_lng = 139.767125;
    let lat = getCookie('latitude');
    let lng = getCookie('longitude');
    let zoom = getCookie('zoom');
    //let lat=tokyo_lat;
    //let lng=tokyo_lng;

    if( lat && lng && zoom ) {
      console.log(`保存された位置情報を利用: 緯度 ${lat}, 経度 ${lng}, ズームレベル ${zoom}`);
      initializeMap(lat,lng,zoom);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position.coords);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        initializeMap(lat,lng,13);
      }, function () {
        initializeMap(tokyo_lat, tokyo_lng, 13); // 東京駅
      });
    } else {
      initializeMap(tokyo_lat, tokyo_lng, 13); // 東京駅
    }
  }
  // 駅のデータを基にマップとリストを更新
  function updateMapAndList(stations) {
    const stationList = document.getElementById('station-list');
    stationList.innerHTML = ''; // 既存のリストをクリア

    stations.forEach(station => {
      // マップにマーカーを追加
      const marker = L.marker([station.lat, station.lng]).addTo(map);
      marker.bindPopup(`<b>${station.station_name}</b><br>オムライス指数: ${station.index}`);

      // リストにオムライス指数を追加
      const row = document.createElement('tr');
      row.innerHTML = `<td>${station.station_name}</td><td>${station.index?station.index:""}</td>`;

      // Add click event to redirect to station.html with station_name as query parameter
      row.addEventListener('click', () => {
        window.location.href = `station.html?station_id=${station.station_id}`;
      });

      stationList.appendChild(row);
    });
  }
  async function fetchStationData() {
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const center = map.getCenter();
    const zoom = map.getZoom();
    saveLocation(center.lat,center.lng,zoom);

    // Supabaseからstation_masterテーブルの駅データを取得
    const { data, error } = await supabaseClient
      .from('station_master')
      .select('*')
      .gte('lat', sw.lat)
      .lte('lat', ne.lat)
      .gte('lng', sw.lng)
      .lte('lng', ne.lng);
    const flag = 0;
    // オムライス指数を取得
    for (const station of data) {
      const result = await fetchOmuIndexData(station.station_name, station.station_id, station.lat, station.lng);
      if (result != null) {
        if( result.index ) {
          station.index = result.index;
        } else if( flag ) {
          // Fetch the Omurice Index using getOmuIndexMain() function (assumed to be defined)
          const response = await fetch(`/.netlify/functions/getOmuIndexByID?station_id=${station.station_id}`);
          const omuIndex = await response.json();
          station.index = omuIndex.index;
        } else {
          station.index = 0;
        }
      }
    }
    data.sort((a,b) => b.index - a.index);

    if (error) {
      console.error('Error fetching station data:', error);
      return;
    }
    updateMapAndList(data);
  }
  async function fetchOmuIndexData(station_name,station_id,lat,lng) {
    const result = await fetch(`/.netlify/functions/fetchOmuIndexData?station_name=${station_name}&station_id=${station_id}&lat=${lat}&lng=${lng}`);
    console.log(`RESULT::: ${result}`);
    return await result.json();
  }
  // ページ読み込み時にマップを初期化
  window.onload = initMap;
