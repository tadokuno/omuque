document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const fileInput = document.querySelector('#file');
    const file = fileInput.files[0];

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
                        station: formData.get('station'),
                        egg: formData.get('egg'),
                        rice: formData.get('rice'),
                        sauce: formData.get('sauce'),
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