import { Hono } from 'hono';
import { Context } from 'hono';
import { supabase } from './supabaseClient';
import { GoogleMapData } from './types';

const app = new Hono();

const exclusionCafe = ["ルノアール", "TULLY’S COFFEE", "タリーズコーヒー", "カフェ・ベローチェ", "椿屋カフェ", "カフェ・ド・クリエ", "ドトールコーヒーショップ", "サンマルクカフェ", "エクセルシオール"];
const exclusionRestraunt = ["揚州商人", "銀座アスター", "日高屋", "バーミヤン", "つばめグリル", "オムサコライス", "やよい軒", "ロイヤルホスト", "俺のハンバーグ", "卵と私", "ポムの樹", "洋麺屋五右衛門", "ガスト", "中華食堂 一番館", "三九厨房"];

// 駅の緯度経度を取得する関数
export async function getCoordinates(stationName: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(stationName)}&key=${apiKey}`;
  console.log(geocodeUrl);
  const response = await fetch(geocodeUrl);
  const data: any = await response.json();

  if (data.status === 'OK') {
    const location = data.results[0].geometry.location;
    return location;
  } else {
    throw new Error('Geocoding API Error: ' + data.status);
  }
}

// Nearby Search APIを使用して店舗数を取得する関数
async function getAllPlaceCount(lat: number, lng: number, tpy: string, kwd: string, radius: number, exclusion: string[]) {
  const apiKey = process.env.GOOGLE_API_KEY;
  let totalCount = 0;
  let nextPageToken: string | null = null;
  let places = "";

  do {
    let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${tpy}&key=${apiKey}&language=ja&keyword=${kwd}`;
    if (nextPageToken) {
      placesUrl += `&pagetoken=${nextPageToken}`;
    }

    let response;
    console.log(placesUrl);
    try {
      response = await fetch(placesUrl);
    } catch (error) {
      console.log(error);
      throw new Error('Nearby Search Error');
    }
    if (!response.ok) {
      throw new Error('Nearby Search Error: ' + response.status);
    }
    const data: any = await response.json();

    if (data.status === 'INVALID_REQUEST') {
      return {
        count: totalCount,
        message: `${places}`
      };
    }

    for (let place of data.results) {
      if (exclusion.some(substring => place.name.includes(substring))) {
        continue;
      }
      if (place.business_status === 'OPERATIONAL') {
        places += `${place.name}\n`;
        totalCount++;
      }
    }
    nextPageToken = data.next_page_token;

    console.log(`現在の店舗数: ${totalCount}件`);
    if (nextPageToken) {
      await new Promise(resolve => setTimeout(resolve, 2000));  // APIに負荷をかけないように待機
    }
  } while (nextPageToken);

  return {
    count: totalCount,
    message: `${places}`
  };
}

// オムライスインデックスを計算する関数
export async function getOmuIndexCountable(lat: number, lng: number): Promise<GoogleMapData|null> {
  try {
    // 緯度経度から指定した範囲内の店舗数を取得
    const localCafe = await getAllPlaceCount(lat, lng, "cafe", "local", 300, exclusionCafe);
    const chineseRestaurant = await getAllPlaceCount(lat, lng, "restaurant", encodeURIComponent("町中華"), 300, exclusionRestraunt);
    const westernRestaurant = await getAllPlaceCount(lat, lng, "restaurant", encodeURIComponent("洋食屋"), 300, exclusionRestraunt);
    const snack = await getAllPlaceCount(lat, lng, "bar", encodeURIComponent("スナック"), 300, exclusionRestraunt);

    // 結果をオブジェクトとして返す
    return {
      localCafe: { count: localCafe.count, message: localCafe.message },
      chineseRestaurant: { count: chineseRestaurant.count, message: chineseRestaurant.message },
      westernRestaurant: { count: westernRestaurant.count, message: westernRestaurant.message },
      snack: { count: snack.count, message: snack.message },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default app;
