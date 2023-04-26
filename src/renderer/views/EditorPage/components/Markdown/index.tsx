import React, {
  MouseEventHandler,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { TextSelection } from "@remirror/pm/state";
import { Node as PMNode } from "@remirror/pm/model";
import {
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  StrikethroughIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
  PinBottomIcon,
} from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import { CountExtension } from "@remirror/extension-count";
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
import * as Tooltip from "@radix-ui/react-tooltip";
import "remirror/styles/all.css";
import "./style.less";
import { AppContext } from "~src/renderer/hooks/appContext";

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

const hooks = [useSaveHook];

const Menu = () => {
  const { toggleItalic, toggleMark } = useCommands();
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

  return (
    <div className="editor-menu">
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

function Footer() {
  const { getCharacterCount } = useHelpers();
  const { getState } = useRemirrorContext({ autoUpdate: true });
  const { filePath } = useContext(AppContext);
  return (
    <div className="footer">
      <div className="charsCount">chars: {getCharacterCount(getState())}</div>
      <div className="filePath">{filePath || ""}</div>
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
    content: localStorage.getItem("data") || "",
    selection: "start",
    stringHandler: "markdown",
  });

  return (
    <div className="remirror-container">
      <Remirror initialContent={state} manager={manager} hooks={hooks}>
        <Menu />
        <EditorComponent />
        <Footer />
      </Remirror>
    </div>
  );
};
