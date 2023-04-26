import * as React from "react";
import * as ReactDom from "react-dom";
import { EditorPage } from "./views/EditorPage";
import "./global.less";

const App = () => {
  return <EditorPage />;
};

const render = () => ReactDom.render(<App />, document.getElementById("root"));
render();

window.addEventListener("dragover", (e) => {
  e.preventDefault();
});
window.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      window.$$filePath$$ = file.path;
      window.$$fileContent$$ = e.target?.result as string;
      const event = new CustomEvent("updateFileContent", {
        detail: {
          content: window.$$fileContent$$,
        },
      });

      window.dispatchEvent(event);
    };
    reader.readAsText(file);
  }
});
