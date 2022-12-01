import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { Button, Dropdown, Modal } from "antd";
import cls from "classnames";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotebooks,
  NotebookOutput,
  setCurrent,
  setNotebooks,
} from "../../../../reducers/notebooksSlice";
import { AppDispatch, RootState } from "../../../../store";
import {
  CreateNotebookModal,
  CreateNotebookModalRef,
} from "../CreateNotebookModal";
import "./style.less";

export const Notebooks = () => {
  const notebooks = useSelector((state: RootState) => state.notebooks);

  const dispatch = useDispatch<AppDispatch>();

  const createModalRef = useRef<CreateNotebookModalRef | null>(null);

  const handleCreateNotebook = async (name: string) => {
    await window.Bridge?.createNotebook(name);
    dispatch(fetchNotebooks());
  };

  const handleSelectNotebook = (data: NotebookOutput) => {
    dispatch(setCurrent(data));
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
          const arr = notebooks.list.slice();
          const idx = arr.findIndex((n) => n.id == data.id);
          if (idx > -1) {
            arr.splice(idx, 1);
            dispatch(setNotebooks(arr));
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  useEffect(() => {
    dispatch(fetchNotebooks());
  }, []);

  return (
    <div className="notebooks">
      <div className="notebooks_header">
        <Button
          className="create-notebook-btn"
          icon={<PlusOutlined />}
          type="primary"
          autoFocus={false}
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
        {notebooks.list.map((n) => {
          const c = cls("notebook-item", {
            selected: notebooks.current?.id == n.id,
          });
          return (
            <div
              className={c}
              key={n.id}
              data-id={n.id}
              onClick={() => handleSelectNotebook(n)}
            >
              <span>{n.name}</span>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "delete",
                      danger: true,
                      label: "删除笔记本",
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
