import * as React from "react";
import * as ReactDom from "react-dom";
import { Editor } from "./views/Editor";

import "./global.less";

const App = () => {
  return <Editor />;
};

ReactDom.render(<App />, document.getElementById("root"));
