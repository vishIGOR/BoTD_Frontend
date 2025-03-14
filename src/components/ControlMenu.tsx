import { Button } from "antd";
import { FileExcelOutlined, PlusOutlined } from "@ant-design/icons";

interface ControlMenuProps {
  onExportClick: () => void;
  onCreateClick: () => void;
}

const ControlMenu = ({ onExportClick, onCreateClick }: ControlMenuProps) => {
  return (
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
        onClick={onCreateClick}
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
  );
};

export default ControlMenu;