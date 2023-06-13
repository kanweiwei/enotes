import { EditableInput } from "@/components/EditableInput";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  CaretRightIcon,
  ArchiveIcon,
  PlusIcon,
  CaretDownIcon,
  CheckIcon,
  Cross2Icon,
  ReaderIcon,
  CrumpledPaperIcon,
} from "@radix-ui/react-icons";
import { useMount } from "ahooks";
import { EditIcon } from "lucide-react";
import React, { useCallback, useState } from "react";

interface Document {
  id: number;
  name: string;
  editable: boolean;
}

export const DocumentsPanel = () => {
  const [isCollapsed, setCollapsed] = useState(false);

  const [documents, setDocuments] = useState<
    Array<{ name: string; id: number; editable: boolean }>
  >([]);

  const handleCreateBook = useCallback(() => {
    if (documents.some((n) => n.id == 0)) return;
    const newDocuments = documents.slice();
    newDocuments.push({ name: "document", id: 0, editable: true });
    setDocuments(newDocuments);
  }, [documents]);

  const handleDeleteDocument = useCallback(
    async (item: Document, index: number) => {
      if (await window.Bridge?.deleteBook(item.id)) {
        const newDocuments = documents.slice();
        newDocuments.splice(index, 1);
        setDocuments(newDocuments);
      }
    },
    [documents]
  );

  const handleStartRename = useCallback(
    (item: Document, index: number) => {
      const newDocuments = documents.slice();
      newDocuments[index].editable = true;
      setDocuments(newDocuments);
    },
    [documents]
  );

  const handleRename = useCallback(
    async (n: Document, value?: string) => {
      const newDocuments = documents.slice();
      const idx = newDocuments.findIndex((item) => item.id == n.id);
      if (n.id == 0 && value) {
        // create
        const row = await window.Bridge?.createBook(value);
        console.log(row);
        if (!row) {
          const newDocuments = documents.slice();
          newDocuments.splice(idx, 1);
          setDocuments(newDocuments);
          return;
        }
        newDocuments.splice(idx, 1, {
          ...row,
          editable: false,
        });
        setDocuments(newDocuments);
      } else {
        if (n.name !== value && value && value.trim().length > 0) {
          // update
          if (await window.Bridge?.updateBook({ ...n, name: value })) {
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
    (n: Document, index: number) => {
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

  useMount(() => {
    void (async () => {
      const res = await window.Bridge?.getAllBooks();
      if (res) {
        setDocuments(
          res.map((n) => {
            return {
              ...n,
              editable: false,
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
              <CaretRightIcon className="cursor-pointer" />
            ) : (
              <CaretDownIcon className="cursor-pointer" />
            )}
          </span>{" "}
          <ArchiveIcon /> Documents
        </div>
        <div className="btns">
          <PlusIcon className="cursor-pointer" onClick={handleCreateBook} />
        </div>
      </div>
      <div className="panel-content">
        {documents.map((n, index) => {
          return (
            <div className="" data-id={n.id} data-name={n.name} key={n.id}>
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
                  <ContextMenuTrigger className="group h-7 hover:bg-gray-200 cursor-pointer m-2 p-2 flex items-center rounded text-ellipsis overflow-hidden whitespace-nowrap group-data-[state=open]:bg-gray-200 select-none">
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
                        className="flex flex-row items-center cursor-pointer"
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
                    <ContextMenuItem>
                      <div
                        className="flex flex-row items-center cursor-pointer"
                        onClick={() => handleStartRename(n, index)}
                      >
                        <EditIcon width={14} height={14} className="mr-2" />
                        <span>Rename</span>
                      </div>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
