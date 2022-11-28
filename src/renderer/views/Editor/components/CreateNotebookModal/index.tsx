import { Modal, Form, Input } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";

interface CreateNotebookModalProps {
  onCreateNotebook: (name: string) => Promise<void>;
}

export interface CreateNotebookModalRef {
  setVisible: (visible: boolean) => void;
}

export const CreateNotebookModal = forwardRef<
  CreateNotebookModalRef,
  CreateNotebookModalProps
>((props, ref) => {
  const [modalVisible, setMoalVisible] = useState(false);

  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      await props.onCreateNotebook(values.name);
      setMoalVisible(false);
    });
  };

  useImperativeHandle(ref, (): CreateNotebookModalRef => {
    return {
      setVisible: setMoalVisible,
    };
  });
  return (
    <Modal
      visible={modalVisible}
      title="创建笔记本"
      onCancel={() => setMoalVisible(false)}
      onOk={handleOk}
      cancelText="取消"
      okText="确定"
      destroyOnClose
    >
      <Form form={form}>
        <Form.Item
          label="笔记本名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请填写名称",
            },
            {
              whitespace: true,
              message: "禁止使用空格",
            },
            { min: 1, max: 100, message: "字符长度请保持在 1-100之间" },
          ]}
        >
          <Input required />
        </Form.Item>
      </Form>
    </Modal>
  );
});
