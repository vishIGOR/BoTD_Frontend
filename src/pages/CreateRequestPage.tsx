import { Form, Input, Button, DatePicker, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";

const CreateRequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onFinish = (values: any) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("reason", values.reason);
    formData.append("date", values.date.format("YYYY-MM-DD"));
    formData.append("status", "На проверке");
    if (file) {
      formData.append("document", file);
    }

    axios.post("https://api.example.com/requests", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      message.success("Заявка успешно создана!");
    })
    .catch(() => {
      message.error("Не удалось создать заявку.");
    })
    .finally(() => {
      setLoading(false);
    });
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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Создать заявку</h1>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item name="reason" label="Причина пропуска" rules={[{ required: true, message: "Введите причину!" }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="date" label="Дата пропуска" rules={[{ required: true, message: "Выберите дату!" }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Прикрепить документ" name="document">
          <Upload beforeUpload={() => false} onChange={handleFileChange} maxCount={1}>
            <Button icon={<UploadOutlined />}>Загрузить файл</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Создать заявку</Button>
      </Form>
    </div>
  );
};

export default CreateRequestPage;
