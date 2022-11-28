import { PlusSquareOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  CreateNotebookModal,
  CreateNotebookModalRef,
} from "../CreateNotebookModal";
import cls from "classnames";
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
        <Input />
        <PlusSquareOutlined
          className="create-notebook-btn"
          onClick={() => createModalRef.current?.setVisible(true)}
        />
        <CreateNotebookModal
          ref={createModalRef}
          onCreateNotebook={handleCreateNotebook}
        />
      </div>
      <div className="notebooks_list">
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
              {n.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
