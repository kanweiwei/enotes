import {
  EditorComponent,
  Remirror,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import React, { useCallback } from "react";
import {
  BoldExtension,
  HeadingExtension,
  ItalicExtension,
  MarkdownExtension,
  PlaceholderExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import "./style.less";

async function saveContent(content: string) {
  // Fake API call
  console.log(content);
}

interface UseSaveHook {
  saving: boolean;
  error: Error | undefined;
}

// Create a hook which saves the content as markdown whenever `Ctrl-s` on Mac `Cmd-s` is pressed.
function useSaveHook() {
  const helpers = useHelpers();
  const [state, setState] = React.useState<UseSaveHook>({
    saving: false,
    error: undefined,
  });

  useKeymap(
    "Mod-s",
    useCallback(() => {
      // Convert the editor content to markdown.
      const markdown = helpers.getMarkdown();

      setState({ saving: true, error: undefined });
      saveContent(markdown)
        .then(() => {
          setState({ saving: false, error: undefined });
        })
        .catch((error) => {
          setState({ saving: true, error });
        });

      return true;
    }, [helpers])
  );

  return state;
}

const hooks = [useSaveHook];

const Menu = () => {
  return (
    <div className="editor-menu">
      <span className="icon iconfont icon-enotes-jiacu"></span>
      <span className="icon iconfont icon-enotes-xieti"></span>
      <span className="icon iconfont icon-enotes-xiahuaxian"></span>
    </div>
  );
};

export const Markdown = () => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new PlaceholderExtension({
        placeholder: "请输入文字",
      }),
      new BoldExtension(),
      new ItalicExtension(),
      new MarkdownExtension(),
      new HeadingExtension(),
    ],
    content: "",
    selection: "start",
    stringHandler: "markdown",
  });

  return (
    <div className="remirror-container">
      <Remirror manager={manager} initialContent={state} hooks={hooks}>
        <Menu />
        <EditorComponent />
      </Remirror>
    </div>
  );
};
