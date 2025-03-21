import { Button } from "antd";
import {
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CreateRequestModal from "./CreateRequestForm";
import { useState } from "react";
import { Request } from "../models/Request";
import { useUserProfileContext } from "../context/UserProfileContext";

const ControlMenu = ({
  onExportFilesClick,
  onExportTableClick,
  onCreateCallback,
  exportFilesDownloading,
  exportTableDownloading,
}: {
  onExportFilesClick: () => void;
  onExportTableClick: () => void;
  onCreateCallback: (request: Request) => void;
  exportFilesDownloading: boolean;
  exportTableDownloading: boolean;
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
          <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: 10 }}>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={onExportFilesClick}
              size="large"
              loading={exportFilesDownloading}
              style={{ width: "50%" }}
            >
              Экспорт документов
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={onExportTableClick}
              size="large"
              loading={exportTableDownloading}
              style={{ width: "50%" }}
            >
              Экспорт таблицы заявок
            </Button>
          </div>
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
