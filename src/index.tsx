import { Hono } from 'hono';
import { renderer } from './renderer';
import Header from './components/Header';
import type {apiKeys} from './api/types';

type Bindings = {
  OPENAI_API_KEY: string;
  GOOGLE_API_KEY: string;
};

const app = new Hono<{Bindings: Bindings }>();

app.use(renderer);

// ルートパスでtopmenu.htmlにリダイレクト
app.get('/', (c) => {
  return c.redirect('/static/topmenu.html');
});

// エントリーポイントとしてnewmapを追加
app.get('/newmap', (c) => {
  return c.render(
    <html>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/simplebar@5.3.6/dist/simplebar.min.js"></script>
    <link href="/static/newmap.css" rel="stylesheet" />
    <Header>
    <div id="map"></div>
    <div class="content" data-simplebar data-simplebar-auto-hide="false">
      <div id="omurice-list">
      <table>
        <thead>
          <tr>
            <th>駅名</th>
            <th>オムライス指数</th>
          </tr>
        </thead>
        <tbody id="station-list">
        </tbody>
      </table>
      </div>
    </div>
    </Header>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script src="https://unpkg.com/leaflet.locatecontrol/dist/L.Control.Locate.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
    <script src='static/main.js' defer></script>
    </html>
  );
});

// エントリーポイントとしてnewmapを追加
app.get('/omuregist', (c) => {
  return c.render(
    <html>
    <title>オムライス登録</title>
    <Header>
    <div class="content" data-simplebar data-simplebar-auto-hide="false">
    <header>オムライス登録</header>
      <main>
        <form id="uploadForm" method="post" enctype="multipart/form-data">
          <div class="text">
            <label for="station">駅名:</label>
            <input type="text" name="station" id="station" required/>
          </div>
          <div class="choices">
            <p>卵の種類：</p>
            <label>
              <input type="radio" name="egg" value="5"/> しっかり焼いた薄焼き卵 <br/>
            </label>
            <label>
              <input type="radio" name="egg" value="3"/> バターたっぷりふわトロ <br/>
            </label>
            <label>
              <input type="radio" name="egg" value="1"/> 野菜などが入っている <br/>
            </label>
            <label>
              <input type="radio" name="egg" value="0"/> その他 <br/>
            </label>
          </div>
          <div class="choices">
            <p>ライスの種類：</p>
            <label>
              <input type="radio" name="rice" value="10"/> チキンライス <br/>
            </label>
            <label>
              <input type="radio" name="rice" value="5"/> ケチャップライス <br/>
            </label>
            <label>
              <input type="radio" name="rice" value="2"/> ピラフ <br/>
            </label>
            <label>
              <input type="radio" name="rice" value="0"/> 白飯 <br/>
            </label>
          </div>
          <div class="choices">
            <p>ソースの種類：</p>
            <label>
              <input type="radio" name="sauce" value="5"/> ケチャップ <br/>
            </label>
            <label>
              <input type="radio" name="sauce" value="4"/> ケチャップベースのソース <br/>
            </label>
            <label>
              <input type="radio" name="sauce" value="2"/> デミグラスソース <br/>
            </label>
            <label>
              <input type="radio" name="sauce" value="0"/> その他 <br/>
            </label>
          </div>
          <div class="file-upload">
            <label for="file">画像をアップロード：</label>
            <input type="file" id="file" name="file" accept="image/*" required/>
          </div>
          <div class="button-container">
            <input type="submit" value="送信" class="button"/>
          </div>
        </form>
        <div id="completeMessage" class="complete-message">完了しました </div>
      </main>
      <footer>(c) OmuQuest</footer>
    </div>
    </Header>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
    <script type="text/javascript" src='static/main.js' defer></script>
    <script type="text/javascript" src='static/omuregist.js' defer></script>
    </html>
  );
});

app.get('/omuregcomplete', (c) => {
  return c.render(
    <html>
    <title>ファイルアップロード</title>
    <link rel="stylesheet" href="static/style.css"/>
    <link rel="stylesheet" href="static/omuregcomplete.css"/>
    <Header>
    <div id="map"></div>
    <div class="content" data-simplebar data-simplebar-auto-hide="false">
      <form id="uploadForm" enctype="multipart/form-data">
        <label for="file">ファイルを選択:</label>
        <input type="file" id="file" name="file" required/><br/><br/>
        <button type="submit">アップロード</button>
      </form>
      <div id="completeMessage" class="complete-message">完了しました</div>
    </div>
    </Header>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
    <script src='static/main.js' defer></script>
    <script type="text/javascript" src='static/omuregcomplete.js' defer></script>
    </html>
  );
});

app.get('/station', (c) => {
  const station_id = c.req.query('station_id')
  const station_name = c.req.query('station_name')

  console.log(`/station ${station_id},${station_name}`);
  return c.render(
    <html>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>駅周辺情報</title>
    <link rel="stylesheet" href="static/style.css"/>
    <link rel="stylesheet" href="static/station.css"/>
    <Header>
    <div class="content" data-simplebar data-simplebar-auto-hide="false">
    中目黒駅 <br/>
            オムライス指数: 33<br/><br/>

            喫茶店の数: 15件<br/>
            町中華の数: 13件<br/>
            
            6: 中目黒駅周辺には比較的古い商店街が存在し、少し懐かしさを感じるが、現代的な店も多い。<br/>
            7: 駅周辺には細い道や入り組んだ路地が多く、散策するとレトロな雰囲気を味わえる。<br/>
            4: 古くからの営業を続ける店は残っているが、新しい開発の影響でその数は限られている。<br/>
            3: 古いショーケースや食品サンプルを飾っている店は少なく、全体的にモダンな印象が強い。<br/>
    </div>
      <div class="input-window" data-simplebar data-simplebar-auto-hide="false">
        <div class="title-bar">
           <span class="title">情報登録</span>
           <div class="buttons">
              <button class="minimize">-</button>
              <button class="close">x</button>
           </div>
        </div>
        <div class="contentb" data-simplebar data-simplebar-auto-hide="false">
          <form id="uploadForm" method="post" enctype="multipart/form-data">
            <div class="text">
              <label for="station">駅名</label>
              <input type="text" name="station" id="station" value="" required/>
            </div>
            <fieldset class="choices">
              <legend>商店街の様子</legend>
                <label>
                  <input type="radio" name="shoutengai" value="10"/> アーケードのある昔ながらの商店街があり、活況である <br/>
                </label>
                <label>
                  <input type="radio" name="shoutengai" value="5"/> 商店街はあるが、シャッターが閉まっている店がちらほら <br/>
                </label>
                <label>
                  <input type="radio" name="shoutengai" value="0"/> 商店街が見当たらない <br/>
                </label>
            </fieldset>
            <fieldset class="choices">
              <legend>周辺道路の様子</legend>
              <label>
                <input type="radio" name="michi" value="10"/> 細い路地があちこちにあり、町の奥行きを感じる <br/>
              </label>
              <label>
                <input type="radio" name="michi" value="5"/> 道は少ないが整備されていない <br/>
              </label>
              <label>
                <input type="radio" name="michi" value="0"/> きれいに区画整理されている。 <br/>
              </label>
            </fieldset>
            <fieldset class="choices">
              <legend>古い店が残っているか</legend>
              <label>
                <input type="radio" name="furuiMise" value="10"/> 昔からやっていると思われる店が多く見られる <br/>
              </label>
              <label>
                <input type="radio" name="furuiMise" value="5"/> 再開発が進んでおり、ビルに入っている店が多い <br/>
              </label>
              <label>
                <input type="radio" name="furuiMise" value="0"/> チェーン店のような店が大半である <br/>
              </label>
            </fieldset>
            <fieldset class="choices">
              <legend>ショーケースや食品サンプル</legend>
              <label>
                <input type="radio" name="shokuSample" value="10"/> ショーケースの中に食品サンプルを置いている店がある <br/>
              </label>
              <label>
                <input type="radio" name="shokuSample" value="5"/> ショーケースは無いが、写真やメニューを出している店がある <br/>
              </label>
              <label>
                <input type="radio" name="shokuSample" value="2"/> ランチ時の案内程度 <br/>
              </label>
              <label>
                <input type="radio" name="shokuSample" value="0"/> 表からはあまりよく分からない <br/>
              </label>
            </fieldset>
            <fieldset class="choices">
              <legend>古い飲食ビルがあるかどうか</legend>
              <label>
                <input type="radio" name="building" value="10"/> 昔からある古い飲食ビルが何軒もあり、昼間でも営業している <br/>
              </label>
              <label>
                <input type="radio" name="building" value="5"/> 古い飲食ビルはあるが、昼間は営業していない店が大半 <br/>
              </label>
              <label>
                <input type="radio" name="building" value="2"/> 飲食ビルはあるが、大半が新しいビルで古い店は見当たらない <br/>
              </label>
              <label>
                <input type="radio" name="building" value="0"/> 飲食ビルは全く見当たらない <br/>
              </label>
            </fieldset>
            <fieldset class="choices">
              <legend>チェーン店が少ないかどうか</legend>
              <label>
                <input type="radio" name="chain" value="10"/> チェーン店ではないローカルの店が大半 <br/>
              </label>
              <label>
                <input type="radio" name="chain" value="7"/> チェーン店がちらほらあるが、ローカルの店が多い <br/>
              </label>
              <label>
                <input type="radio" name="chain" value="5"/> チェーン店が多くあるが、ローカルの店も多い <br/>
              </label>
              <label>
                <input type="radio" name="chain" value="2"/> 大半がチェーン店のように見える <br/>
              </label>
            </fieldset>
          <div class="file-upload">
            <label for="file">画像をアップロード：</label>
            <input type="file" id="file" name="file" accept="image/*"/>
          </div>
          <div class="button-container">
            <input type="submit" value="送信" class="button"/>
          </div>
        </form>
      </div>
      <footer>(c) OmuQuest</footer>
    </div>


    </Header>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
    <script src='static/main.js' defer></script>
    <script type="text/javascript" src='static/station.js' defer></script>
    </html>
  );
});



import {Context} from 'hono';

// 以下は関数

app.get('/getEnv', (c:Context) => {
  const result = {
    supabaseUrl: c.env.SUPABASE_API_URL,
    supabaseKey: c.env.SUPABASE_API_KEY
  }
  return c.json(result,200);
});

function toInt(param: string|undefined): number|undefined {
  return param?parseInt(param,10):undefined;
}
function toFloat(param: string|undefined): number|undefined {
  return param?parseFloat(param):undefined;
}

import type { StationData,OmuriceIndexHeader,OmuriceIndexData } from './api/types';
import * as accesslib from './api/accesslib';

app.get('/fetchOmuIndexData', async (c) => {
  // クエリパラメータを取得
  const station_name = c.req.query('station_name');
  const station_id = toInt(c.req.query('station_id'));
  const lat = toFloat(c.req.query('lat'));
  const lng = toFloat(c.req.query('lng'));

  if (!station_name || !station_id || !lat || !lng) {
    return c.json({ error: 'Missing required query parameters' }, 400);
  }

  // fetchOmuriceIndexData を呼び出し
  let result: OmuriceIndexHeader | null = await accesslib.fetchOmuriceIndexData(station_name, station_id, lat, lng);
  if (!result) {
    result = {
      index: 0,
      stationName: station_name,
      station_id, 
      lat,
      lng
    };
  }

  return c.json(result, 200);
});

app.get('/fetchStationIds', async (c) => {
  // クエリパラメータを取得
  const sw_lat = c.req.query('sw_lat');
  const sw_lng = c.req.query('sw_lng');
  const ne_lat = c.req.query('ne_lat');
  const ne_lng = c.req.query('ne_lng');

  // パラメータの型チェックと変換
  if (!sw_lat || !sw_lng || !ne_lat || !ne_lng) {
    return c.json({ error: 'Missing required query parameters' }, 400);
  }

  const swLatNum = parseFloat(sw_lat);
  const swLngNum = parseFloat(sw_lng);
  const neLatNum = parseFloat(ne_lat);
  const neLngNum = parseFloat(ne_lng);

  if (isNaN(swLatNum) || isNaN(swLngNum) || isNaN(neLatNum) || isNaN(neLngNum)) {
    return c.json({ error: 'Invalid query parameter values' }, 400);
  }

  // Supabase から駅データを取得
  const result:StationData[]|null = await accesslib.fetchStationIds(swLatNum, swLngNum, neLatNum, neLngNum);

  if ( !result ) {
    return c.json({ error: "fetchStationIds Error" }, 500);
  }

  return c.json(result, 200);
});

import { getOmuIndexByID } from './api/script'

app.get('/getOmuIndexByID', async (c) => {
  // クエリパラメータを取得
  const station_id = c.req.query('station_id');
  if (!station_id) {
    return c.json({ error: 'Missing station_id' }, 400);
  }

  const keys:apiKeys = {
    openaiApiKey: c.env.OPENAI_API_KEY,
    googleApiKey: c.env.GOOGLE_API_KEY
  };

  try {
    const result = await getOmuIndexByID(keys,station_id);
    console.log(result);
    return c.json(result);
  } catch (error) {
    console.error('Error fetching Omu Index by ID:', error);
    return c.json({ error: 'Failed to fetch Omu Index' }, 500);
  }
});


export default app;
