import { Button } from "antd";
import { FileExcelOutlined, PlusOutlined } from "@ant-design/icons";
import CreateRequestModal from "./CreateRequestForm";
import { useState } from "react";
import { Request } from "../models/Request";
import { useUserProfileContext } from "../context/UserProfileContext";

const ControlMenu = ({
  onExportClick,
  onCreateCallback,
  exportDownloading,
}: {
  onExportClick: () => void;
  onCreateCallback: (request: Request) => void;
  exportDownloading: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userProfile } = useUserProfileContext();

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
          style={{
            height:
              userProfile.role === "STUDENT" || userProfile.role === "DEAN"
                ? 40
                : 90,
          }}
        >
          Создать заявку
        </Button>
        {userProfile.role === "DEAN" && (
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={onExportClick}
            size="large"
            loading={exportDownloading}
          >
            Экспорт всех заявок
          </Button>
        )}
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
