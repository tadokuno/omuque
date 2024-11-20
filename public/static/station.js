        // Function to get URL parameters
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
          }
          
          // Function to fetch and display Omurice Index
          async function displayStationInfo() {
            const station_id = getQueryParam('station_id');
            const station_name = getQueryParam('station_name');
            if (station_id) {
              // Display station name
              document.querySelector('.content').innerHTML = `<h2>${station_name}</h2><p>読み込み中...</p>`;
  
              // Fetch the Omurice Index using getOmuIndexMain() function (assumed to be defined)
              const response = await fetch(`/.netlify/functions/getOmuIndexByID?station_id=${station_id}`);
              const omuIndex = await response.json();
              document.querySelector('.content').innerHTML = `${omuIndex.stationName}`;
  
              // Update content with fetched data
              let message = `
              <h2>${omuIndex.stationName}</h2>
                <p>オムライス指数: ${omuIndex.index}</p><br>
                <p>喫茶店の数: ${omuIndex.googlemap.localCafe.count}</p>
                <p>町中華の数: ${omuIndex.googlemap.chineseRestaurant.count}</p>
                <p>洋食屋の数: ${omuIndex.googlemap.westernRestaurant.count}</p>
                <p>スナックの数: ${omuIndex.googlemap.snack.count}</p>
                <br>
              `;
              const openai = omuIndex.openai;
              for (let key in openai ) {
                  const data = openai[key];
                  message += `<p>${data.index}: ${data.text}</p>`;
              }
              message += `<h3>お店リスト</h3><ul><li>`;
              const googlemap = omuIndex.googlemap;
              for (let key in googlemap ) {
                  const data = googlemap[key];
                  const msg = data.message;
                  const listmsg = msg.replace(/\n/g,"</li><li>");
                  message += `${listmsg}`;
              }
              message += `</li></ul>`;
  
              document.querySelector('.content').innerHTML = message;
  
              // 登録エリアに駅名を設定する
              const stationInput = document.getElementById('station');
              stationInput.value = station_name;
  
            } else {
              document.querySelector('.content').innerHTML = '<p>駅が選択されていません。</p>';
            }
          }
          
          // Call displayStationInfo on page load
          window.onload = displayStationInfo;
          document.getElementById('uploadForm').addEventListener('submit', async function (e) {
      e.preventDefault();
  
              const formData = new FormData(e.target);
              const fileInput = document.querySelector('#file');
              const file = fileInput.files[0];
              if( file.size > 10 * 1024 * 1024 ) {
                  alert('ファイルサイズが大きすぎます。10MB以下のファイルを選択してください');
                  return;
              }
  
              if (file) {
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                      const imageData = reader.result.split(',')[1];  // Base64データに変換
  
                      try {
                          const location = await getUserLocation();  // スマホのGPS情報を取得
                          console.log(location);
                      }
                      catch {
                          console.error('位置情報の取得に失敗しました: ', error);
                          alert('位置情報の取得に失敗しました。GPSを確認してください。');
                      }
                      try {
                          // フォームデータと画像をサーバーに送信
                          const response = await fetch('/.netlify/functions/upload', {
                              method: 'POST',
                              body: JSON.stringify({
                                  table_name: "openai_info",
                                  station: formData.get('station'),
                                  shoutengai: formData.get('shoutengai'),
                                  michi: formData.get('michi'),
                                  furui_mise: formData.get('furuiMise'),
                                  shoku_sample: formData.get('shokuSample'),
                                  building: formData.get('building'),
                                  chain: formData.get('chain'),
                                  userLat: location.lat,  // GPSから取得した緯度
                                  userLng: location.lng,  // GPSから取得した経度
                                  fileName: file.name,
                                  image: imageData       // Base64に変換された画像データ
                              }),
                              headers: {
                                  'Content-Type': 'application/json',
                              },
                          });
  
                          const result = await response.json();
                          console.log(result.message);
  
                          if (response.ok) {
                              document.getElementById('completeMessage').style.display = 'block';
                          }
                      } catch (error) {
                          console.error('フォームデータの登録に失敗しました: ', error);
                          alert('フォームデータの登録に失敗しました。');
                      }
                  };
                  reader.readAsDataURL(file); // 画像をBase64に変換
              }
          });