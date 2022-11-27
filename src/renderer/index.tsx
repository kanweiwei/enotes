import * as React from "react";
import * as ReactDom from "react-dom";
import { Editor } from "./views/Editor";

import "./global.less";
import "../static/font/iconfont.css";

const App = () => {
  return <Editor />;
};

ReactDom.render(<App />, document.getElementById("root"));
