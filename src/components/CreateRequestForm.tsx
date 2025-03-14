import { useState } from "react";
import { Form, Input, Button, DatePicker, Upload, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createRequest } from "../utils/requests";

interface CreateRequestModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const CreateRequestModal = ({
  isModalOpen,
  setIsModalOpen,
}: CreateRequestModalProps) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      await createRequest({
        reason: values.reason,
        date: values.date.format("YYYY-MM-DD"),
        status: "На проверке",
        file: file || undefined,
      });

      message.success("Заявка успешно создана!");
      setIsModalOpen(false);
      form.resetFields();
      setFile(null);
    } catch {
      message.error("Не удалось создать заявку.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFile(null);
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === "done") {
      setFile(info.file.originFileObj);
      message.success(`${info.file.name} загружен.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} не удалось загрузить.`);
    }
  };

  return (
    <Modal
      title="Создать заявку"
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
          Создать
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Причина пропуска"
          rules={[{ required: true, message: "Введите причину!" }]}
        >
          <Input.TextArea size="large" />
        </Form.Item>
        <Form.Item
          name="date"
          label="Дата пропуска"
          rules={[{ required: true, message: "Выберите дату!" }]}
        >
          <DatePicker size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Прикрепить документ" name="document">
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} size="large">
              Загрузить файл
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRequestModal;
