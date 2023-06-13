import {
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  PinBottomIcon,
  StrikethroughIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CountExtension } from "@remirror/extension-count";
import { Node as PMNode, Slice } from "@remirror/pm/model";
import { EditorState, TextSelection } from "@remirror/pm/state";
import {
  EditorComponent,
  Remirror,
  useActive,
  useCommands,
  useHelpers,
  useKeymap,
  useRemirror,
  useRemirrorContext,
} from "@remirror/react";
import React, {
  MouseEventHandler,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  HeadingExtension,
  ItalicExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  TaskListExtension,
  UnderlineExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import { AppContext } from "../../../../hooks/appContext";
import "./style.less";
import { createPortal } from "react-dom";

async function saveContent(content: string, filePath?: string) {
  let res = true;
  localStorage.setItem("data", content);
  if (filePath && window.Bridge) {
    res = await window.Bridge.save(filePath, content);
  }
  return res;
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
      saveContent(markdown, window.$$filePath$$)
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

const useCopyHook = () => {
  const { getState, schema, manager } = useRemirrorContext({
    autoUpdate: true,
  });
  const helpers = useHelpers();
  useKeymap(
    "Mod-c",
    useCallback(() => {
      const state = getState();
      const selection = state.selection;
      function createNewEditorState(state: EditorState, slice: Slice) {
        const { tr, schema } = state;
        tr.replace(0, tr.doc.content.size, slice);
        const newState = EditorState.create({
          schema,
          doc: tr.doc,
          selection: tr.selection,
        });
        return newState;
      }
      const newState = createNewEditorState(getState(), selection.content());
      const text = helpers.getMarkdown(newState);
      navigator.clipboard.writeText(text);
      return true;
    }, [helpers])
  );
};

const usePasteHook = () => {
  const commands = useCommands();
  useKeymap(
    "Mod-v",
    useCallback(() => {
      void (async () => {
        const text = await navigator.clipboard.readText();
        commands.insertMarkdown(text);
      })();
      return true;
    }, [])
  );
};

const hooks = [useSaveHook, useCopyHook, usePasteHook];

const Menu = () => {
  const { toggleItalic, toggleMark, insertMarkdown } = useCommands();
  const helpers = useHelpers();
  const active = useActive();
  const { getState, schema, manager } = useRemirrorContext({
    autoUpdate: true,
  });
  const { updateFilePath } = useContext(AppContext);
  const state = getState();

  const insertList = useCallback(
    (node: PMNode) => {
      const position = state.selection.$from.pos;
      let tr = state.tr.insert(position, node).insertText("");
      const newPosition = tr.doc.resolve(position + 2);
      const newSelection = new TextSelection(newPosition, newPosition);
      tr.setSelection(newSelection);
      const newState = state.apply(tr);
      manager.view.updateState(newState);
    },
    [state]
  );

  const handleInsertOrderedList: MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault();
      const orderedListNode = schema.nodes.orderedList.create(
        {},
        schema.nodes.listItem.create({}, schema.nodes.paragraph.create({}))
      );
      insertList(orderedListNode);
    },
    [state]
  );

  const handleInsertBulletList: MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault();
      const bulletListNode = schema.nodes.bulletList.create(
        {},
        schema.nodes.listItem.create({}, schema.nodes.paragraph.create({}))
      );
      insertList(bulletListNode);
    },
    [state]
  );

  const handleInsertTaskList: MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault();
      const taskListNode = schema.nodes.taskList.create(
        {},
        schema.nodes.taskListItem.create({}, schema.nodes.paragraph.create({}))
      );
      insertList(taskListNode);
    },
    [state]
  );
  const handleExport = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    void (async () => {
      const filePath = await window.Bridge?.export(helpers.getMarkdown());

      if (filePath) {
        updateFilePath(filePath);
        window.$$filePath$$ = filePath;
      }
    })();
  }, []);

  const handleSave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    void (async () => {
      if (window.$$filePath$$) {
        await window.Bridge?.save(window.$$filePath$$, helpers.getMarkdown());
      } else {
        handleExport(e);
      }
    })();
  }, []);

  useEffect(() => {
    function updateFileContent(content: string) {
      manager.view.updateState(
        state.apply(
          state.tr.replaceWith(
            0,
            state.doc.content.size,
            manager.createEmptyDoc()
          )
        )
      );
      insertMarkdown(content);
    }
    // @ts-ignore
    const updateFileContentHandler: EventListener = (
      evt: CustomEvent<{ content?: string }>
    ) => updateFileContent(evt.detail.content || "");
    window.addEventListener("updateFileContent", updateFileContentHandler);

    // @ts-ignore
    const openFileHandler: EventListener = async (
      e: CustomEvent<{ filePath: string }>
    ) => {
      if (window.Bridge) {
        const content = await window.Bridge.getFileContent(e.detail.filePath);
        window.$$filePath$$ = e.detail.filePath;
        window.$$fileContent$$ = content;
        updateFileContent(content);
      }
    };
    window.addEventListener("openFile", openFileHandler);

    return () => {
      window.removeEventListener("updateFileContent", updateFileContentHandler);
      window.removeEventListener("openFile", openFileHandler);
    };
  }, []);

  return (
    <div className="editor-menu flex flex-row flex-nowrap items-center p-2 rounded xl:w-[840px] bg-white z-10 sticky top-0 shadow">
      <Toolbar.Root className="ToolbarRoot" aria-label="Formatting options">
        <Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
          <Toolbar.ToggleItem
            className="ToolbarToggleItem"
            value="bold"
            aria-label="Bold"
            data-state={active.bold() ? "on" : "off"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark({ type: "bold", selection: state.selection });
            }}
          >
            <FontBoldIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="ToolbarToggleItem"
            value="italic"
            aria-label="Italic"
            data-state={active.italic() ? "on" : "off"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleItalic();
            }}
          >
            <FontItalicIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="ToolbarToggleItem"
            value="underline"
            aria-label="Underline"
            data-state={active.underline() ? "on" : "off"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark({ type: "underline", selection: state.selection });
            }}
          >
            <UnderlineIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="ToolbarToggleItem"
            value="strikethrough"
            aria-label="Strike through"
            data-state={active.strike() ? "on" : "off"}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark({ type: "strike", selection: state.selection });
            }}
          >
            <StrikethroughIcon />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
        <Toolbar.Separator className="ToolbarSeparator" />
        <Toolbar.ToggleGroup type="single" aria-label="Text alignment" disabled>
          <Toolbar.ToggleItem
            className="ToolbarToggleItem"
            value="left"
            aria-label="Left aligned"
          >
            <TextAlignLeftIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="ToolbarToggleItem"
            value="center"
            aria-label="Center aligned"
          >
            <TextAlignCenterIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="ToolbarToggleItem"
            value="right"
            aria-label="Right aligned"
          >
            <TextAlignRightIcon />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
        <Toolbar.Separator className="ToolbarSeparator" />
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Toolbar.Button
                className="ToolbarButton"
                data-state="off"
                onMouseDown={handleInsertOrderedList}
              >
                <ListBulletIcon />
              </Toolbar.Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                OrderedList
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Toolbar.Button
                className="ToolbarButton"
                data-state="off"
                onMouseDown={handleInsertBulletList}
              >
                <ListBulletIcon />
              </Toolbar.Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                BulletList
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Toolbar.Button
                className="ToolbarButton"
                data-state="off"
                onMouseDown={handleInsertTaskList}
              >
                <ListBulletIcon />
              </Toolbar.Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent">
                TaskList
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
        <Toolbar.Button
          className="ToolbarButton saveBtn"
          style={{ marginLeft: "auto" }}
          onMouseDown={handleSave}
        >
          Save
        </Toolbar.Button>
        <Toolbar.Button
          className="ToolbarButton exportBtn"
          onMouseDown={handleExport}
        >
          <PinBottomIcon />
        </Toolbar.Button>
      </Toolbar.Root>
    </div>
  );
};

interface FooterProps {
  parent: RefObject<HTMLDivElement | null>;
}
function Footer() {
  const { getCharacterCount } = useHelpers();
  const { getState } = useRemirrorContext({ autoUpdate: true });
  const { filePath } = useContext(AppContext);
  return (
    <div className="footer sticky bottom-0 text-xs text-slate-700 flex bg-white">
      <div className="charsCount">chars: {getCharacterCount(getState())}</div>
      <div className="filePath">{window.$$filePath$$ || filePath || ""}</div>
    </div>
  );
}

export const Markdown = () => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new PlaceholderExtension({
        placeholder: "input content",
      }),
      new MarkdownExtension(),
      new BoldExtension(),
      new ItalicExtension(),
      new StrikeExtension(),
      new UnderlineExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
      new TaskListExtension(),
      new HeadingExtension(),
      new CodeBlockExtension(),
      new CountExtension(),
    ],
    content: window.$$fileContent$$ || localStorage.getItem("data") || "",
    selection: "start",
    stringHandler: "markdown",
  });

  return (
    <div className="relative flex-grow h-full overflow-auto">
      <header className="app-header h-[40px] bg-white border-b z-10"></header>
      <div className="overflow-auto" style={{ height: "calc(100% - 40px)" }}>
        <div className="remirror-container flex flex-col h-full px-7 relative m-auto my-0 max-w-[840px]">
          <Remirror initialContent={state} manager={manager} hooks={hooks}>
            <Menu />
            <EditorComponent />
            <Footer />
          </Remirror>
        </div>
      </div>
    </div>
  );
};
