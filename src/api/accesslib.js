import { supabase } from './supabaseClient';
function toInt(param) {
    return param ? parseInt(param, 10) : undefined;
}
function toFloat(param) {
    return param ? parseFloat(param) : undefined;
}
export async function fetchStationIds(sw_lat, sw_lng, ne_lat, ne_lng) {
    // Supabaseからstation_masterテーブルの駅データを取得
    const { data, error } = await supabase
        .from('station_master')
        .select('station_id,station_name,lat,lng')
        .gte('lat', sw_lat)
        .lte('lat', ne_lat)
        .gte('lng', sw_lng)
        .lte('lng', ne_lng);
    if (error) {
        return null;
    }
    return data;
}
// オムライス指数データの登録
export async function registerOmuriceIndex(station_id, omuIndexData) {
    try {
        const openaiId = await insertOpenAIInfo(station_id, omuIndexData.openai.shoutengai, omuIndexData.openai.michi, omuIndexData.openai.furuiMise, omuIndexData.openai.shokuSample, omuIndexData.openai.building, omuIndexData.openai.chain);
        const googlemapId = await insertGoogleMapInfo(station_id, omuIndexData.googlemap.localCafe, omuIndexData.googlemap.chineseRestaurant, omuIndexData.googlemap.westernRestaurant, omuIndexData.googlemap.snack);
        if (openaiId && googlemapId) {
            await insertOmuriceIndex(station_id, omuIndexData.lat, omuIndexData.lng, openaiId, googlemapId, omuIndexData.index);
            console.log('All data inserted successfully!');
        }
    }
    catch (error) {
        console.error('Error in registerOmuriceIndex:', error);
    }
}
async function insertOpenAIInfo(stationId, shoutengai, michi, furuiMise, shokuSample, building, chain) {
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
    }
    else {
        console.log('OpenAI info inserted:', data[0]);
        return data[0].id;
    }
}
async function insertGoogleMapInfo(stationId, localCafe, chineseRestaurant, westernRestaurant, snack) {
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
    }
    else {
        console.log('Google Map info inserted:', data[0]);
        return data[0].id;
    }
}
async function insertOmuriceIndex(stationId, lat, lng, openaiId, googlemapId, omuriceIndex) {
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
    }
    else {
        console.log('Omurice Index inserted:', data);
    }
}
// 駅情報の取得（駅名から）
export async function fetchStationMaster(stationName) {
    try {
        const { data: stationData, error: stationError } = await supabase
            .from('station_master')
            .select('station_id, station_name, lat, lng')
            .eq('station_name', stationName);
        if (stationError) {
            console.log(`Cannot find station: ${stationName}\n`);
            throw stationError;
        }
        const convert = stationData.map((obj) => ({
            station_id: Number(obj.station_id),
            station_name: obj.station_name,
            lat: Number(obj.lat),
            lng: Number(obj.lng),
        }));
        return convert;
    }
    catch {
        return null;
    }
}
// 駅情報の取得（駅IDから）
export async function fetchStationMasterByID(station_id) {
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
    }
    catch {
        return null;
    }
}
// オムライス指数データの取得
export async function fetchOmuriceIndexData(stationName, station_id, lat, lng) {
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
        if (omuriceIndexError)
            throw omuriceIndexError;
        const { index, googlemap_id, openai_id } = omuriceIndexData;
        const { data: googlemapData, error: googlemapError } = await supabase
            .from('googlemap_info')
            .select('local_cafe_count, local_cafe_message, chinese_restaurant_count, chinese_restaurant_message, western_restaurant_count, western_restaurant_message, snack_count, snack_message')
            .eq('id', googlemap_id)
            .single();
        if (googlemapError)
            throw googlemapError;
        const { data: openaiData, error: openaiError } = await supabase
            .from('openai_info')
            .select('*')
            .eq('id', openai_id)
            .single();
        if (openaiError)
            throw openaiError;
        const result = {
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
    }
    catch (error) {
        console.error('Error fetching omurice index data:', error);
        return null;
    }
}
