import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Request } from "../models/Request"; // Adjust imports based on your models
import { editRequest } from "../utils/requests";
import { useUserProfileContext } from "../context/UserProfileContext";

const { RangePicker } = DatePicker;
const { Option } = Select;

const EditRequestForm = ({
  isModalOpen,
  setIsModalOpen,
  request,
  onEditCallback,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  request: Request | null;
  onEditCallback: (updatedRequest: Request) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { userProfile } = useUserProfileContext();

  useEffect(() => {
    if (isModalOpen && request) {
      form.setFieldsValue({
        reason: request.reason,
        comment: request.comment,
        period: [dayjs(request.dateStart), dayjs(request.dateEnd)],
        status: request.status,
        fileInDean: request.fileInDean,
      });
    }
  }, [request, form, isModalOpen]);

  if (!request) {
    return null;
  }

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const newFields = {
        creatorId: request.creator.id,
        dateStart: values.period[0].toDate(),
        dateEnd: values.period[1].toDate(),
        comment: values.comment,
        status: values.status,
        reason: values.reason,
        fileInDean: values.fileInDean,
      };

      try {
        await editRequest(request.id, newFields);
      } catch {
        message.error("Не удалось обновить заявку");
      }

      message.success("Заявка успешно обновлена!");
      onEditCallback({ ...request, ...newFields });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при обновлении заявки:", error);
      message.error("Не удалось обновить заявку.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Редактировать заявку"
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
          Сохранить
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          reason: request.reason,
          comment: request.comment,
          period: [dayjs(request.dateStart), dayjs(request.dateEnd)],
          status: request.status,
          fileInDean: request.fileInDean,
        }}
      >
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

        <Form.Item
          name="status"
          label="Статус"
          rules={[{ required: true, message: "Выберите статус" }]}
        >
          <Select
            disabled={userProfile.role === "STUDENT"}
            style={{ width: "100%" }}
            size="large"
          >
            <Option value="PENDING">На рассмотрении</Option>
            <Option value="APPROVED">Одобрено</Option>
            <Option value="DECLINED">Отклонено</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fileInDean"
          label="Документы в деканате"
          rules={[{ required: true, message: "Отметьте статус документов" }]}
        >
          <Select
            disabled={userProfile.role === "STUDENT"}
            style={{ width: "100%" }}
            size="large"
          >
            <Option value={true}>Да</Option>
            <Option value={false}>Нет</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRequestForm;
