// src/components/Header.tsx
import { Hono } from 'hono'
import type {FC} from 'hono/jsx'

const Header: FC = (props) => {
  return (
      <body>
        <div class="window">
          <div class="title-bar">
            <span class="title">OmuQue Manager</span>
            <div class="buttons">
              <button class="minimize">-</button>
              <a href="/static/topmenu.html"><button id="close" className="close">x</button></a>
            </div>
          </div>
        </div>
        {props.children}
      </body>
  );
};

export default Header;

