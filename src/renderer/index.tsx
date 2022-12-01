import * as React from "react";
import * as ReactDom from "react-dom";
import { Editor } from "./views/Editor";
import { store } from "./store";
import { Provider } from "react-redux";
import "./global.less";
import "../static/font/iconfont.css";

const App = () => {
  return <Editor />;
};

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
