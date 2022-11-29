import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal } from "antd";
import cls from "classnames";
import React, { useEffect, useRef, useState } from "react";
import {
  CreateNotebookModal,
  CreateNotebookModalRef,
} from "../CreateNotebookModal";
import "./style.less";

interface NotebookOutput {
  id: number;
  name: string;
  create_at: string;
  update_at: string;
}

export const Notebooks = () => {
  const [notebooks, setNotebooks] = useState<NotebookOutput[]>([]);
  const createModalRef = useRef<CreateNotebookModalRef | null>(null);

  const handleCreateNotebook = async (name: string) => {
    await window.Bridge?.createNotebook(name);
    const data = await window.Bridge?.getNotebooks();
    if (data) {
      setNotebooks(data);
    }
  };

  const [selectedNotebookId, setSelectedNotebookId] = useState<
    number | undefined
  >();
  const handleSelectNotebook = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.dataset.id) {
      setSelectedNotebookId(Number(e.currentTarget.dataset.id));
    }
  };

  const handleDeleteNoteBook = async (data: NotebookOutput) => {
    Modal.confirm({
      title: "注意",
      content: `是否删除该笔记本 ${data.name}`,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          await window.Bridge?.deleteNotebook(data.id);
          const arr = notebooks.slice();
          const idx = arr.findIndex((n) => n.id == data.id);
          if (idx > -1) {
            arr.splice(idx, 1);
            setNotebooks(arr);
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  useEffect(() => {
    void (async () => {
      const data = await window.Bridge?.getNotebooks();
      if (data) {
        setNotebooks(data);
      }
    })();
  });

  return (
    <div className="notebooks">
      <div className="notebooks_header">
        <Button
          className="create-notebook-btn"
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => createModalRef.current?.setVisible(true)}
        >
          新建
        </Button>

        <CreateNotebookModal
          ref={createModalRef}
          onCreateNotebook={handleCreateNotebook}
        />
      </div>
      <div className="notebooks-list">
        {notebooks.map((n) => {
          const c = cls("notebook-item", {
            selected: selectedNotebookId == n.id,
          });
          return (
            <div
              className={c}
              key={n.id}
              data-id={n.id}
              onClick={handleSelectNotebook}
            >
              <span>{n.name}</span>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "delete",
                      danger: true,
                      label: "删除笔记",
                      onClick: () => handleDeleteNoteBook(n),
                    },
                  ],
                }}
              >
                <MoreOutlined />
              </Dropdown>
            </div>
          );
        })}
      </div>
    </div>
  );
};
