import * as React from "react";
import * as ReactDom from "react-dom";
import { EditorPage } from "./views/EditorPage";
import "./global.less";

const App = () => {
  return <EditorPage />;
};

ReactDom.render(<App />, document.getElementById("root"));
