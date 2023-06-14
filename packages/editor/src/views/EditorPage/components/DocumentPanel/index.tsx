import { EditableInput } from "@/components/EditableInput";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  CaretRightIcon,
  ArchiveIcon,
  PlusIcon,
  CaretDownIcon,
  ReaderIcon,
  CrumpledPaperIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { useMount } from "ahooks";
import { EditIcon } from "lucide-react";
import React, { useCallback, useState } from "react";

interface DocumentView extends DocumentDto {
  editable: boolean;
  pages: PageView[];
}

interface PageView extends PageDto {
  editable: boolean;
}

export const DocumentsPanel = () => {
  const [isCollapsed, setCollapsed] = useState(false);

  const [documents, setDocuments] = useState<DocumentView[]>([]);

  const handleCreateDocument = useCallback(() => {
    if (documents.some((n) => n.id == 0)) return;
    const newDocuments = documents.slice();
    newDocuments.push({
      name: "document",
      id: 0,
      editable: true,
      pages: [],
    });
    setDocuments(newDocuments);
  }, [documents]);

  const handleDeleteDocument = useCallback(
    async (item: DocumentView, index: number) => {
      if (await window.Bridge?.deleteDocument(item.id)) {
        const newDocuments = documents.slice();
        newDocuments.splice(index, 1);
        setDocuments(newDocuments);
      }
    },
    [documents]
  );

  const handleStartRename = useCallback(
    (item: DocumentView, index: number) => {
      const newDocuments = documents.slice();
      newDocuments[index].editable = true;
      setDocuments(newDocuments);
    },
    [documents]
  );

  const handleRename = useCallback(
    async (n: DocumentView, value?: string) => {
      const newDocuments = documents.slice();
      const idx = newDocuments.findIndex((item) => item.id == n.id);
      if (n.id == 0 && value) {
        // create
        const row = await window.Bridge?.createDocument(value);
        if (!row) {
          const newDocuments = documents.slice();
          newDocuments.splice(idx, 1);
          setDocuments(newDocuments);
          return;
        }
        newDocuments.splice(idx, 1, {
          ...n,
          ...row,
          editable: false,
        });
        setDocuments(newDocuments);
      } else {
        if (n.name !== value && value && value.trim().length > 0) {
          // update
          if (await window.Bridge?.updateDocument({ ...n, name: value })) {
            newDocuments[idx].name = value;
          }
        }
        newDocuments[idx].editable = false;
        setDocuments(newDocuments);
      }
    },
    [documents]
  );

  const handleCancelRenameDocument = useCallback(
    (n: DocumentView, index: number) => {
      const newDocuments = documents.slice();
      if (n.id == 0) {
        newDocuments.splice(index, 1);
      } else {
        newDocuments[index].editable = false;
      }
      setDocuments(newDocuments);
    },
    [documents]
  );

  const handleStartCreateNewPage = useCallback(
    async (doc: DocumentView, index: number) => {
      const row = await window.Bridge?.createPage({
        documentId: doc.id,
        name: "page",
      });
      const newDocuments = documents.slice();
      newDocuments[index].pages.push({ ...row, editable: false });
      setDocuments(newDocuments);
    },
    [documents]
  );

  const handleStartRenamePage = useCallback(
    (pageIndex: number, index: number) => {
      const newDocuments = documents.slice();
      newDocuments[index].pages[pageIndex].editable = true;
      setDocuments(newDocuments);
    },
    [documents]
  );

  const handleDeletePage = useCallback(
    async (page: PageView, pageIndex: number, index: number) => {
      if (await window.Bridge?.deletePage(page.id)) {
        const newDocuments = documents.slice();
        newDocuments[index].pages.splice(pageIndex, 1);
        setDocuments(newDocuments);
      }
    },
    [documents]
  );

  const handleRenamePage = useCallback(
    async (
      e: React.MouseEvent<HTMLElement>,
      value: string,
      page: PageView,
      pageIndex: number,
      docIndex: number
    ) => {
      value = value.trim();
      const newDocs = documents.slice();
      if (value) {
        if (await window.Bridge?.updatePageName(page.id, value)) {
          newDocs[docIndex].pages[pageIndex].name = value;
        }
      }
      newDocs[docIndex].pages[pageIndex].editable = false;
      setDocuments(newDocs);
    },
    [documents]
  );

  const handleCancelRenamePage = useCallback(
    (pageIndex: number, index: number) => {
      const newDocuments = documents.slice();
      newDocuments[index].pages[pageIndex].editable = false;
      setDocuments(newDocuments);
    },
    [documents]
  );

  useMount(() => {
    void (async () => {
      const res = await window.Bridge?.getWithPages();
      if (res) {
        setDocuments(
          res.map((n) => {
            return {
              ...n,
              editable: false,
              pages: n.pages.map((p) => ({
                ...p,
                editable: false,
              })),
            };
          })
        );
      }
    })();
  });

  return (
    <div className="documents-panel overflow-hidden">
      <div className="panel-header flex flex-row justify-between items-center p-2 border-solid border-b border-slate-200 text-sm text-slate-700">
        <div className="flex felx-row items-center gap-2 select-none">
          <span onClick={() => setCollapsed(!isCollapsed)}>
            {isCollapsed ? (
              <CaretRightIcon className="" />
            ) : (
              <CaretDownIcon className="" />
            )}
          </span>{" "}
          <ArchiveIcon /> Documents
        </div>
        <div className="btns">
          <PlusIcon className="" onClick={handleCreateDocument} />
        </div>
      </div>
      <div className="panel-content">
        {documents.map((n, index) => {
          return (
            <div key={n.id}>
              {n.editable ? (
                <div className="px-2 py-2 border-b border-t">
                  <EditableInput
                    defaultValue={n.name}
                    handleOk={(e, value) => handleRename(n, value)}
                    handleCancel={() => handleCancelRenameDocument(n, index)}
                  />
                </div>
              ) : (
                <ContextMenu>
                  <ContextMenuTrigger className="group h-7 hover:bg-neutral-300 active:bg-neutral-400 m-2 p-2 flex items-center rounded text-ellipsis overflow-hidden whitespace-nowrap group-data-[state=open]:bg-gray-200 select-none">
                    <ReaderIcon className="mr-1 flex-none" />
                    <div
                      className="flex-auto overflow-hidden text-ellipsis"
                      title={n.name}
                    >
                      {n.name}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="bg-white">
                    <ContextMenuItem>
                      <div
                        className="flex flex-row items-center text-xs"
                        onClick={() => handleStartRename(n, index)}
                      >
                        <EditIcon width={14} height={14} className="mr-2" />
                        <span>Rename</span>
                      </div>
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <div
                        className="flex flex-row items-center text-xs"
                        onClick={() => handleStartCreateNewPage(n, index)}
                      >
                        <FileTextIcon width={14} height={14} className="mr-2" />
                        <span>New Page</span>
                      </div>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>
                      <div
                        className="flex flex-row items-center text-xs"
                        onClick={() => handleDeleteDocument(n, index)}
                      >
                        <CrumpledPaperIcon
                          width={14}
                          height={14}
                          className="mr-2"
                        />
                        <span>Delete</span>
                      </div>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )}
              <div className="pages-container">
                {n.pages.map((page, pageIndex) => {
                  if (page.editable) {
                    return (
                      <div className="px-4" key={page.id}>
                        <EditableInput
                          defaultValue={page.name}
                          handleOk={(e, value) =>
                            handleRenamePage(e, value, page, pageIndex, index)
                          }
                          handleCancel={() =>
                            handleCancelRenamePage(pageIndex, index)
                          }
                        />
                      </div>
                    );
                  }
                  return (
                    <ContextMenu key={page.id}>
                      <ContextMenuTrigger>
                        <div className="group h-7 hover:bg-neutral-300 active:bg-neutral-400  m-2 p-2 pl-4 flex items-center rounded  group-data-[state=open]:bg-gray-200 select-none">
                          <FileTextIcon
                            width={14}
                            height={14}
                            className="mr-2"
                          />
                          <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {page.name}
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem>
                          <div
                            className="flex flex-row items-center text-xs"
                            onClick={() =>
                              handleStartRenamePage(pageIndex, index)
                            }
                          >
                            <EditIcon width={14} height={14} className="mr-2" />
                            <span>Rename</span>
                          </div>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem>
                          <div
                            className="flex flex-row items-center text-xs"
                            onClick={() =>
                              handleDeletePage(page, pageIndex, index)
                            }
                          >
                            <EditIcon width={14} height={14} className="mr-2" />
                            <span>Delete</span>
                          </div>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
