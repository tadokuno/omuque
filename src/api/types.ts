export type StationData = {
    station_id: number;
    station_name: string;
    lat: number;
    lng: number;
}

export type OmuriceIndexHeader = {
    index: number;
    stationName: string;
    station_id: number;
    lat: number;
    lng: number;
};

export type GoogleMapData = {
    localCafe: {
        count: number;
        message: string;
    };
    chineseRestaurant: {
        count: number;
        message: string;
    };
    westernRestaurant: {
        count: number;
        message: string;
    };
    snack: {
        count: number;
        message: string;
    };
}

export type OpenaiData = {
    shoutengai: {
        index: number;
        text: string;
    };
    michi: {
        index: number;
        text: string;
    };
    furuiMise: {
        index: number;
        text: string;
    };
    shokuSample: {
        index: number;
        text: string;
    };
    building: {
        index: number;
        text: string;
    };
    chain: {
        index: number;
        text: string;
    };
}

// OmuriceIndexData 型の定義
// OmuriceIndexHeader に加えて、googlemap と openai のデータを含めた型
export interface OmuriceIndexData extends OmuriceIndexHeader {
    googlemap: GoogleMapData;
    openai: OpenaiData;
};

export type apiKeys = {
    openaiApiKey: string,
    googleApiKey: string,
};