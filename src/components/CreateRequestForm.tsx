import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
import { useUserProfileContext } from "../context/UserProfileContext";
import { createRequest } from "../utils/requests";
import { Request } from "../models/Request";

const { RangePicker } = DatePicker;
const { Option } = Select;

const CreateRequestModal = ({
  isModalOpen,
  setIsModalOpen,
  onCreateCallback,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onCreateCallback: (request: Request) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { userProfile } = useUserProfileContext();

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const createdRequest = await createRequest({
        comment: values.comment,
        reason: values.reason,
        dateStart: values.period?.[0].toDate(),
        dateEnd: values.period?.[1].toDate(),
        status: "PENDING",
        fileInDean: false,
        fileUrl: [],
        userId: userProfile.id,
      });

      message.success("Заявка успешно создана!");
      onCreateCallback(createdRequest);
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      message.error("Не удалось создать заявку.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
          label="Причина"
          rules={[{ required: true, message: "Выберите причину" }]}
        >
          <Select style={{ width: "100%" }} size="large">
            <Option value="FAMILY">Семейные обстоятельства</Option>
            <Option value="ILLNESS">Болезнь</Option>
            <Option value="STUDENT_ACTIVITY">Студенческая активность</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="comment"
          label="Описание"
          rules={[{ required: true, message: "Опишите причину" }]}
        >
          <Input.TextArea size="large" />
        </Form.Item>

        <Form.Item
          name="period"
          label="Дата пропуска"
          rules={[{ required: true, message: "Выберите дату" }]}
        >
          <RangePicker
            allowEmpty={[false, false]}
            placeholder={["Начало пропуска", "Конец пропуска"]}
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRequestModal;
