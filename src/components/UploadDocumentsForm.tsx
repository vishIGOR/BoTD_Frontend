import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useState } from "react";
import { uploadDocuments } from "../utils/requests";

const UploadDocumentsForm = ({
  isModalOpen,
  setIsModalOpen,
  requestId,
  onUploadCallback,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  requestId: string;
  onUploadCallback: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOk = async () => {
    try {
      setLoading(true);

      if (fileList.length === 0) {
        message.warning("Пожалуйста, выберите файлы для загрузки.");
        return;
      }

      const files = fileList.map((file) => file.originFileObj as RcFile);

      await uploadDocuments(requestId, files);

      message.success("Файлы успешно загружены!");
      setIsModalOpen(false);
      onUploadCallback();
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
      message.error("Не удалось загрузить файлы.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isAllowedType =
      file.type === "application/pdf" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";

    if (!isAllowedType) {
      message.error("Можно загружать только PDF, JPG, JPEG или PNG файлы.");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 30; // 30MB limit
    if (!isLt5M) {
      message.error("Файл должен быть меньше 5MB.");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  return (
    <Modal
      title="Загрузить документы"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Загрузить
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item
          label="Документы"
          rules={[{ required: true, message: "Пожалуйста, выберите файлы" }]}
        >
          <Upload
            multiple
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={beforeUpload}
            listType="picture"
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <Button icon={<UploadOutlined />}>Выберите файлы</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadDocumentsForm;
