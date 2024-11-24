const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }), (error) => {
                switch (error.code) {
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
                reject(new Error("位置情報を取得できませんでした"));
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            });
        }
        else {
            reject(new Error("Geolocationはサポートされていません"));
        }
    });
};
// クッキーを設定する関数
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
// クッキーを取得する関数
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ")
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
// 位置情報を保存する関数
function saveLocation(lat, lng, zoom) {
    setCookie("latitude", lat.toString(), 7);
    setCookie("longitude", lng.toString(), 7);
    setCookie("zoom", zoom.toString(), 7);
    console.log(`位置情報を保存しました: 緯度 ${lat}, 経度 ${lng}`);
}
// 位置情報の取得
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveLocationToCookie, showError);
    }
    else {
        console.error("このブラウザは位置情報取得をサポートしていません。");
    }
}
function saveLocationToCookie(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    setCookie("latitude", lat.toString(), 7);
    setCookie("longitude", lng.toString(), 7);
    console.log(`位置情報を保存しました: 緯度 ${lat}, 経度 ${lng}`);
}
// エラーが発生した場合の処理
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("ユーザーが位置情報の取得を拒否しました。");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("位置情報が利用できません。");
            break;
        case error.TIMEOUT:
            console.error("位置情報の取得がタイムアウトしました。");
            break;
        default:
            console.error("未知のエラーが発生しました。");
            break;
    }
}
// 保存された位置情報を利用する関数
function useSavedLocation() {
    const lat = getCookie("latitude");
    const lng = getCookie("longitude");
    if (lat && lng) {
        console.log(`保存された位置情報を利用: 緯度 ${lat}, 経度 ${lng}`);
        // ここで地図や他の機能に緯度経度を利用できます
    }
    else {
        console.log("保存された位置情報はありません。");
    }
}
// この関数をReactのコンポーネント内で呼び出して、ユーザーの位置情報を取得・保存する
export { getUserLocation, setCookie, getCookie, saveLocation, getLocation, useSavedLocation, };
