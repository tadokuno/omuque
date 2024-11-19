import { getOmuIndexCountable } from './placesApi';
import { calculateOmuIndex } from './openaiApi';
import { registerOmuriceIndex, fetchOmuriceIndexData, fetchStationMaster, fetchStationMasterByID } from './accesslib';
function roundCount(count) {
    return Math.floor(count > 10 ? 10 : count);
}
export async function getOmuIndexByID(station_id) {
    if (!station_id) {
        return null;
    }
    const station = await fetchStationMasterByID(station_id);
    if (station == null) { // マスターに登録されていない
        return null;
    }
    console.log(station_id);
    console.log(station);
    const result = await getOmuIndexMain(station.station_name, station.station_id, station.lat, station.lng);
    return result;
}
export async function getOmuIndexByCord(lat, lng) {
    // 座標が一致する駅を検索する ==> station_id
    // 無ければ、最も近い駅を検索する。==> station_id
    // station_id からオムライス指数を検索する。指数が未計算の場合、計算して登録する。
}
export async function omuIndexMain(stationName) {
    if (!stationName) {
        return null;
    }
    // stationNameからstation_master上のデータを取得する。
    const data = await fetchStationMaster(stationName); // dataは配列
    if (data == null) { // マスターに登録されていない
        return null;
    }
    for (let station of data) {
        const result = await getOmuIndexMain(station.station_name, station.station_id, station.lat, station.lng);
        if (!result) {
            return result;
        }
    }
    return null;
}
async function getOmuIndexMain(stationName, station_id, lat, lng) {
    try {
        let point = 0;
        let result = await fetchOmuriceIndexData(stationName, station_id, lat, lng);
        if (result != null) {
            return result;
        }
        const openaiPromise = calculateOmuIndex(stationName); // openai API 時間かかる
        const result1 = await getOmuIndexCountable(lat, lng); // Places API
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
