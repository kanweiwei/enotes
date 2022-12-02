import { Button, Empty } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes } from "../../../../reducers/notesSlice";
import { AppDispatch, RootState } from "../../../../store";
import "./style.less";

export const Notes = () => {
  const notebooks = useSelector((state: RootState) => state.notebooks);
  const notes = useSelector((state: RootState) => state.notes);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (notebooks.current) {
      dispatch(fetchNotes(notebooks.current.id));
    }
  }, [notebooks.current]);

  const handleCreateNote = () => {};

  const renderNotes = () => {
    if (!notes.list.length)
      return (
        <div className="empty-container">
          <Empty
            description={<Button onClick={handleCreateNote}>创建笔记</Button>}
          />
        </div>
      );
    return notes.list.map((n) => {
      return (
        <div className="note-item" key={n.id}>
          <div className="note-itme__name">{n.name}</div>
          <div>{n.update_at}</div>
        </div>
      );
    });
  };

  if (!notebooks.current) {
    return <div className="notes">选择笔记本</div>;
  }

  return <div className="notes">{renderNotes()}</div>;
};
