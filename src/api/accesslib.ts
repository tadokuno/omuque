import { supabase } from './supabaseClient';
import type { OmuriceIndexHeader,OmuriceIndexData, StationData } from './types';

function toInt(param: string|undefined): number|undefined {
  return param?parseInt(param,10):undefined;
}
function toFloat(param: string|undefined): number|undefined {
  return param?parseFloat(param):undefined;
}


export async function fetchStationIds(
  sw_lat: number,
  sw_lng: number,
  ne_lat: number,
  ne_lng: number
):Promise<StationData[]|null> {
  // Supabaseからstation_masterテーブルの駅データを取得
  const { data, error } = await supabase
    .from('station_master')
    .select('station_id,station_name,lat,lng')
    .gte('lat', sw_lat)
    .lte('lat', ne_lat)
    .gte('lng', sw_lng)
    .lte('lng', ne_lng);

  if( error ) {
    return null;
  }
  return data;
}

// オムライス指数データの登録
export async function registerOmuriceIndex(station_id: number, omuIndexData: OmuriceIndexData ) {
  try {
    const openaiId = await insertOpenAIInfo(
      station_id,
      omuIndexData.openai.shoutengai,
      omuIndexData.openai.michi,
      omuIndexData.openai.furuiMise,
      omuIndexData.openai.shokuSample,
      omuIndexData.openai.building,
      omuIndexData.openai.chain
    );

    const googlemapId = await insertGoogleMapInfo(
      station_id,
      omuIndexData.googlemap.localCafe,
      omuIndexData.googlemap.chineseRestaurant,
      omuIndexData.googlemap.westernRestaurant,
      omuIndexData.googlemap.snack
    );

    if (openaiId && googlemapId) {
      await insertOmuriceIndex(station_id, omuIndexData.lat, omuIndexData.lng, openaiId, googlemapId, omuIndexData.index);
      console.log('All data inserted successfully!');
    }
  } catch (error) {
    console.error('Error in registerOmuriceIndex:', error);
  }
}

export async function insertOpenAIInfo(stationId: number, shoutengai: any, michi: any, furuiMise: any, shokuSample: any, building: any, chain: any) {
  const { data, error } = await supabase
    .from('openai_info')
    .insert([
      {
        station_id: stationId,
        shoutengai_index: shoutengai.index,
        shoutengai_text: shoutengai.text,
        michi_index: michi.index,
        michi_text: michi.text,
        furui_mise_index: furuiMise.index,
        furui_mise_text: furuiMise.text,
        shoku_sample_index: shokuSample.index,
        shoku_sample_text: shokuSample.text,
        building_index: building.index,
        building_text: building.text,
        chain_index: chain.index,
        chain_text: chain.text
      }
    ])
    .select();

  if (error) {
    console.error('Error inserting OpenAI info:', error);
  } else {
    console.log('OpenAI info inserted:', data[0]);
    return data[0].id;
  }
}

async function insertGoogleMapInfo(stationId: number, localCafe: any, chineseRestaurant: any, westernRestaurant: any, snack: any) {
  const { data, error } = await supabase
    .from('googlemap_info')
    .insert([
      {
        station_id: stationId,
        local_cafe_count: localCafe.count,
        local_cafe_message: localCafe.message,
        chinese_restaurant_count: chineseRestaurant.count,
        chinese_restaurant_message: chineseRestaurant.message,
        western_restaurant_count: westernRestaurant.count,
        western_restaurant_message: westernRestaurant.message,
        snack_count: snack.count,
        snack_message: snack.message
      }
    ])
    .select();

  if (error) {
    console.error('Error inserting Google Map info:', error);
  } else {
    console.log('Google Map info inserted:', data[0]);
    return data[0].id;
  }
}

async function insertOmuriceIndex(stationId: number, lat: number, lng: number, openaiId: number, googlemapId: number, omuriceIndex: number) {
  const { data, error } = await supabase
    .from('omurice_index')
    .insert([
      {
        station_id: stationId,
        lat: lat,
        lng: lng,
        openai_id: openaiId,
        googlemap_id: googlemapId,
        index: omuriceIndex
      }
    ]);

  if (error) {
    console.error('Error inserting Omurice Index:', error);
  } else {
    console.log('Omurice Index inserted:', data);
  }
}

// 駅情報の取得（駅名から）
export async function fetchStationMaster(stationName: string): Promise<StationData[]|null> {
  try {
    const { data: stationData, error: stationError } = await supabase
      .from('station_master')
      .select('station_id, station_name, lat, lng')
      .eq('station_name', stationName);

    if (stationError) {
      console.log(`Cannot find station: ${stationName}\n`);
      throw stationError;
    }

    // stationDataは配列
    type stationDataType = {
        station_id: any;
        station_name: any;
        lat: any;
        lng: any;
    }

    const convert: stationDataType[] = stationData.map((obj) => ({
        station_id: Number(obj.station_id),
        station_name: obj.station_name,
        lat: Number(obj.lat),
        lng: Number(obj.lng),
    }));

    return convert;
  } catch {
    return null;
  }
}

// 駅情報の取得（駅IDから）
export async function fetchStationMasterByID(station_id: string) {
  try {
    const { data: stationData, error: stationError } = await supabase
      .from('station_master')
      .select('station_id, station_name, lat, lng')
      .eq('station_id', station_id)
      .single();

    if (stationError) {
      console.log(`Cannot find station ID: ${station_id}\n`);
      throw stationError;
    }
    return stationData;
  } catch {
    return null;
  }
}

// オムライス指数データの取得
export async function fetchOmuriceIndexData(stationName: string, station_id: number, lat: number, lng: number): Promise<OmuriceIndexData|null> {
  if (!station_id) {
    return null;
  }
  console.log(`fetchOID(${stationName}, ${station_id}, ${lat}, ${lng})`);
  try {
    const { data: omuriceIndexData, error: omuriceIndexError } = await supabase
      .from('omurice_index')
      .select('index, googlemap_id, openai_id')
      .eq('station_id', station_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (omuriceIndexError) throw omuriceIndexError;

    const { index, googlemap_id, openai_id } = omuriceIndexData;

    const { data: googlemapData, error: googlemapError } = await supabase
      .from('googlemap_info')
      .select('local_cafe_count, local_cafe_message, chinese_restaurant_count, chinese_restaurant_message, western_restaurant_count, western_restaurant_message, snack_count, snack_message')
      .eq('id', googlemap_id)
      .single();

    if (googlemapError) throw googlemapError;

    const { data: openaiData, error: openaiError } = await supabase
      .from('openai_info')
      .select('*')
      .eq('id', openai_id)
      .single();

    if (openaiError) throw openaiError;

    const result: OmuriceIndexData = {
      index,
      stationName,
      station_id,
      lat,
      lng,
      googlemap: {
        localCafe: {
          count: googlemapData.local_cafe_count,
          message: googlemapData.local_cafe_message
        },
        chineseRestaurant: {
          count: googlemapData.chinese_restaurant_count,
          message: googlemapData.chinese_restaurant_message
        },
        westernRestaurant: {
          count: googlemapData.western_restaurant_count,
          message: googlemapData.western_restaurant_message
        },
        snack: {
          count: googlemapData.snack_count,
          message: googlemapData.snack_message
        }
      },
      openai: {
        shoutengai: {
          index: openaiData.shoutengai_index,
          text: openaiData.shoutengai_text
        },
        michi: {
          index: openaiData.michi_index,
          text: openaiData.michi_text
        },
        furuiMise: {
          index: openaiData.furui_mise_index,
          text: openaiData.furui_mise_text
        },
        shokuSample: {
          index: openaiData.shoku_sample_index,
          text: openaiData.shoku_sample_text
        },
        building: {
          index: openaiData.building_index,
          text: openaiData.building_text
        },
        chain: {
          index: openaiData.chain_index,
          text: openaiData.chain_text
        }
      }
    };

    return result;

  } catch (error) {
    console.error('Error fetching omurice index data:', error);
    return null;
  }
}

// オムライス画像データをDBに登録
export async function registerOmurice(stationName: string, stationId: number, egg: number, rice: number, sauce: number, imageUrl: string ) {
  try {
    const { data, error } = await supabase
    .from('omurice_images')
    .insert([
      {
        station_name: stationName,
        station_id: stationId,
        egg: egg,
        rice: rice,
        sauce: sauce ,
        image_path: imageUrl,
      }
    ])
    .select();
  
    if (error) {
      console.error('Error inserting Omurice Data:', error);
      return null;
    }
    console.log('Omurice data inserted:', data);
    return data?.[0]?.id ?? null;
  } catch (exception) {
    console.error('Exception occurred while inserting Omurice Data:', exception);
    return null;
  }
}

// 駅名と現在位置を使ってstation_idを取得する関数
// ハバースィンの公式を使って2点間の距離を計算
const calculateDistance = (lat1:number, lng1:number, lat2:number, lng2:number) => {
  const R = 6371e3; // 地球の半径（メートル）
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 距離（メートル）
};

export async function getStationId(stationName:string, userLat:number, userLng:number) {
  // Supabaseからstation_nameを使って検索
  const { data: stations, error } = await supabase
      .from('station_master')
      .select('*')
      .eq('station_name', stationName);

  if (error) {
      throw new Error('Supabaseでの駅検索に失敗しました: ' + error.message);
  }

  if (stations.length === 0) {
      throw new Error('該当する駅が見つかりません');
  }

  // 駅が複数見つかった場合、最も近い駅を選択
  if (stations.length > 1) {
      let closestStation = stations[0];
      let closestDistance = calculateDistance(userLat, userLng, closestStation.lat, closestStation.lng);

      for (let i = 1; i < stations.length; i++) {
          const station = stations[i];
          const distance = calculateDistance(userLat, userLng, station.lat, station.lng);

          if (distance < closestDistance) {
              closestDistance = distance;
              closestStation = station;
          }
      }

      return closestStation.station_id;
  } else {
      // 一つしか駅が見つからない場合
      return stations[0].station_id;
  }
};
