import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";

interface EditableInputProps {
  defaultValue?: string;
  handleOk?: (e: React.MouseEvent<HTMLElement>, value?: string) => void;
  handleCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const EditableInput = (props: EditableInputProps) => {
  const {
    handleOk = () => {},
    handleCancel = () => {},
    defaultValue = "",
  } = props;
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.select();
  }, []);

  return (
    <div className="flex flex-row gap-2 items-center">
      <Input
        ref={input}
        className="flex-auto h-7 bg-white w-auto focus-visible:ring-0"
        defaultValue={defaultValue}
        autoFocus
      />
      <i
        className="hover:bg-gray-300 cursor-pointer rounded"
        onClick={(e) => handleOk(e, input.current?.value)}
      >
        <CheckIcon width={20} height={20} />
      </i>
      <i
        className="hover:bg-gray-300 cursor-pointer rounded"
        onClick={handleCancel}
      >
        <Cross2Icon width={20} height={20} />
      </i>
    </div>
  );
};
