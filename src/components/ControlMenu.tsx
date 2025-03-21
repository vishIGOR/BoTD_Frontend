import { Button } from "antd";
import { FileExcelOutlined, PlusOutlined } from "@ant-design/icons";
import CreateRequestModal from "./CreateRequestForm";
import { useState } from "react";

const ControlMenu = ({
  onExportClick,
  onCreateCallback,
}: {
  onExportClick: () => void;
  onCreateCallback: (request: Request) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 16,
          border: "1px solid #d9d9d9",
          borderRadius: 8,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalOpen(true);
          }}
          size="large"
        >
          Создать заявку
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={onExportClick}
          size="large"
        >
          Экспорт всех заявок
        </Button>
      </div>
      <CreateRequestModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onCreateCallback={onCreateCallback}
      />
    </>
  );
};

export default ControlMenu;
