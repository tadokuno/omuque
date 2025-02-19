import { getOmuIndexCountable } from './placesApi';
import { calculateOmuIndex } from './openaiApi';
import { registerOmuriceIndex, fetchOmuriceIndexData, fetchStationMaster, fetchStationMasterByID } from './accesslib';
import { z } from 'zod';
function roundCount(count) {
    return Math.floor(count > 10 ? 10 : count);
}
export async function getOmuIndexByID(keys, station_id) {
    if (!station_id) {
        return null;
    }
    const station = await fetchStationMasterByID(station_id);
    if (station == null) { // マスターに登録されていない
        return null;
    }
    console.log(station_id);
    console.log(station);
    const result = await getOmuIndexMain(keys, station.station_name, station.station_id, station.lat, station.lng);
    return result;
}
export async function getOmuIndexByCord(lat, lng) {
    // 座標が一致する駅を検索する ==> station_id
    // 無ければ、最も近い駅を検索する。==> station_id
    // station_id からオムライス指数を検索する。指数が未計算の場合、計算して登録する。
}
export async function omuIndexMain(keys, stationName) {
    if (!stationName) {
        return null;
    }
    // stationNameからstation_master上のデータを取得する。
    const data = await fetchStationMaster(stationName); // dataは配列
    if (data == null) { // マスターに登録されていない
        return null;
    }
    for (let station of data) {
        const result = await getOmuIndexMain(keys, station.station_name, station.station_id, station.lat, station.lng);
        if (!result) {
            return result;
        }
    }
    return null;
}
async function getOmuIndexMain(keys, stationName, station_id, lat, lng) {
    try {
        let point = 0;
        let result = await fetchOmuriceIndexData(stationName, station_id, lat, lng);
        if (result != null) {
            return result;
        }
        const openaiPromise = calculateOmuIndex(keys.openaiApiKey, stationName); // openai API 時間かかる
        const result1 = await getOmuIndexCountable(keys.googleApiKey, lat, lng); // Places API
        if (!result1) {
            return null;
        }
        const localCafeIndex = roundCount(result1.localCafe.count);
        const chineseRestaurantIndex = roundCount(result1.chineseRestaurant.count);
        const westernRestaurantIndex = roundCount(result1.westernRestaurant.count);
        const snackIndex = roundCount(result1.snack.count);
        point = localCafeIndex + chineseRestaurantIndex + westernRestaurantIndex + snackIndex;
        const result2 = await openaiPromise;
        if (!result2) {
            return null;
        }
        for (const key of Object.keys(result2)) {
            const data = result2[key];
            point += data.index;
        }
        result = {
            index: point,
            station_id,
            stationName,
            lat: lat,
            lng: lng,
            googlemap: result1,
            openai: result2,
        };
        // console.log(JSON.stringify(result,null, 2));
        await registerOmuriceIndex(station_id, result); // どんどん上書きしていく
        return result;
    }
    catch (error) {
        console.error('Error fetching Omu Index:', error);
        return null;
    }
}
export function createLineMessage(stationName, result1, result2, point) {
    let messages = '';
    messages = `喫茶店の数: ${result1.localCafe.count}件\n`;
    messages += `町中華の数: ${result1.chineseRestaurant.count}件\n`;
    messages += `洋食屋の数: ${result1.westernRestaurant.count}件\n`;
    messages += `スナックの数: ${result1.snack.count}件\n`;
    for (let key in result2) {
        const data = result2[key];
        messages += `${data.index}: ${data.text}\n`;
    }
    messages += '\n' + result1.localCafe.message + '\n';
    messages += result1.chineseRestaurant.message + '\n';
    messages += result1.westernRestaurant.message + '\n';
    messages += result1.snack.message + '\n';
    return `${stationName}のオムライス指数: ${point}%\n\n${messages}\n${stationName}のオムライス指数: ${point}%`;
}
export async function uploadImage(accessToken, base64Image, fileName) {
    // Base64 からバイナリデータ (ArrayBuffer) へ変換
    function base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    // 画像をバイナリデータ（ArrayBuffer）に変換
    const imageArrayBuffer = base64ToArrayBuffer(base64Image);
    const imageBlob = new Blob([imageArrayBuffer], { type: 'image/png' }); // 画像のMIMEタイプを適宜変更
    // `FormData` に変換
    const formData = new FormData();
    formData.append('access_token', accessToken);
    formData.append('imagedata', imageBlob, fileName);
    console.log('Uploading image to Gyazo...');
    // Gyazo API のレスポンススキーマを定義
    const GyazoResponseSchema = z.object({
        url: z.string().url(),
    });
    // Gyazo API にアップロード
    const response = await fetch('https://upload.gyazo.com/api/upload', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`Gyazoへのアップロードに失敗しました: ${response.statusText}`);
    }
    const result = GyazoResponseSchema.parse(await response.json());
    return result.url; // Gyazo の画像 URL を返す
}
