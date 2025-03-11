import { useState } from "react";
import { Collapse, Button, Input, DatePicker, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Panel } = Collapse;
const MAX_REQUESTS = 5; // Ограничение числа заявок

interface Request {
  id: string;
  fullName: string;
  groupNumber: string;
  reason: string;
  date: string;
  status: string;
  document?: string;
}

const initialRequests: Request[] = [
  { id: "101", fullName: "Иван Иванов", groupNumber: "Б01-123", reason: "Болезнь", date: "2024-03-01", status: "На проверке", document: "spravka.pdf" },
  { id: "102", fullName: "Мария Смирнова", groupNumber: "Б02-456", reason: "Семейные обстоятельства", date: "2024-02-25", status: "На проверке", document: "" },
  { id: "103", fullName: "Алексей Кузнецов", groupNumber: "Б03-789", reason: "Командировка", date: "2024-02-20", status: "На проверке", document: "komandirovka.pdf" },
];

const RequestCollapseList = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);

  const updateRequest = (id: string, updatedData: Partial<Request>) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updatedData } : req))
    );
    message.success("Заявка обновлена!");
    setEditingRequest(null);
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    message.success("Заявка удалена!");
  };

  const confirmRequest = (id: string) => {
    updateRequest(id, { status: "Одобрено" });
    message.success("Заявка одобрена!");
  };

  const rejectRequest = (id: string) => {
    updateRequest(id, { status: "Отклонено" });
    message.error("Заявка отклонена!");
  };

  return (
    <Collapse accordion>
      {requests.slice(0, MAX_REQUESTS).map((req) => (
        <Panel
          key={req.id}
          header={`${req.fullName} (${req.groupNumber}) - ${req.reason}`}
          extra={<Tag color={req.status === "Одобрено" ? "green" : req.status === "Отклонено" ? "red" : "orange"}>{req.status}</Tag>}
        >
          {editingRequest && editingRequest.id === req.id ? (
            <>
              <Input
                defaultValue={req.reason}
                onChange={(e) => setEditingRequest({ ...editingRequest, reason: e.target.value })}
                style={{ marginBottom: 10 }}
              />
              <DatePicker
                defaultValue={dayjs(req.date)}
                onChange={(date) => setEditingRequest({ ...editingRequest, date: date?.format("YYYY-MM-DD") || req.date })}
                style={{ marginBottom: 10 }}
              />
              <Button type="primary" onClick={() => updateRequest(req.id, editingRequest)}>Сохранить</Button>
            </>
          ) : (
            <>
              <p><b>Дата:</b> {req.date}</p>
              <p>
                <b>Прикрепленный документ:</b>{" "}
                {req.document ? (
                  <a href={`#${req.document}`} download>{req.document}</a>
                ) : (
                  "Нет"
                )}
              </p>
              <Button icon={<EditOutlined />} onClick={() => setEditingRequest(req)} style={{ marginRight: 8 }}>Редактировать</Button>
              <Button icon={<DeleteOutlined />} danger onClick={() => deleteRequest(req.id)} style={{ marginRight: 8 }}>Удалить</Button>
              <Button icon={<CheckCircleOutlined />} type="primary" onClick={() => confirmRequest(req.id)} style={{ marginRight: 8 }}>Одобрить</Button>
              <Button icon={<CloseCircleOutlined />} type="default" danger onClick={() => rejectRequest(req.id)}>Отклонить</Button>
            </>
          )}
        </Panel>
      ))}
    </Collapse>
  );
};

export default RequestCollapseList;
