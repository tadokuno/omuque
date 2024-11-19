import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
const Header = (props) => {
    return (_jsxs("body", { children: [_jsx("div", { class: "window", children: _jsxs("div", { class: "title-bar", children: [_jsx("span", { class: "title", children: "OmuQue Manager" }), _jsxs("div", { class: "buttons", children: [_jsx("button", { class: "minimize", children: "-" }), _jsx("a", { href: "/static/topmenu.html", children: _jsx("button", { id: "close", className: "close", children: "x" }) })] })] }) }), props.children] }));
};
export default Header;
