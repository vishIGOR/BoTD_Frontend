import { useEffect, useState } from "react";
import { Table, Tag, message, Spin, Button } from "antd";
import axios from "axios";

interface Request {
  key: string;
  id: string;
  fullName: string;
  groupNumber: string;
  reason: string;
  date: string;
  status: string;
  document: string;
  comment: string;
}

const statusColors: Record<string, string> = {
  "На проверке": "orange",
  "Одобрено": "green",
  "Отклонено": "red",
};


const mockData: Request[] = [
  { key: "1", id: "101", fullName: "Иван Иванов", groupNumber: "Б01-123", reason: "Болезнь", date: "2024-03-01", status: "На проверке", document: "Справка.pdf", comment: "", },
  { key: "2", id: "102", fullName: "Мария Смирнова", groupNumber: "Б02-456", reason: "Семейные обстоятельства", date: "2024-02-25", status: "Одобрено", document: "", comment: "Одобрено деканатом" },
  { key: "3", id: "103", fullName: "Алексей Кузнецов", groupNumber: "Б03-789", reason: "Командировка", date: "2024-02-20", status: "Отклонено", document: "Командировочное письмо.pdf", comment: "Недостаточно подтверждающих документов" },
];

const RequestList = () => {
  const [requests, setRequests] = useState<Request[]>(mockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://api.example.com/requests") 
      .then((response) => {
        const formattedData = response.data.map((req: any, index: number) => ({
          key: String(index),
          id: req.id,
          fullName: req.fullName,
          groupNumber: req.groupNumber,
          reason: req.reason,
          date: req.date,
          status: req.status,
          document: req.document,
          comment: req.comment,
        }));
        setRequests(formattedData);
      })
      .catch(() => {
        console.warn("Не удалось загрузить данные с API, использую моковые данные.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "ФИО", dataIndex: "fullName", key: "fullName" },
    { title: "Группа", dataIndex: "groupNumber", key: "groupNumber" },
    { title: "Причина", dataIndex: "reason", key: "reason" },
    { title: "Дата", dataIndex: "date", key: "date" },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record: Request) => (
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => approveRequest(record.id)}>Одобрить</Button>
          <Button type="default" danger onClick={() => rejectRequest(record.id)}>Отклонить</Button>
        </>
      ),
    },
  ];

  const expandableRowRender = (record: Request) => (
    <>
      <p><b>Прикрепленный документ:</b> {record.document ? <a href={`#${record.document}`} download>{record.document}</a> : "Нет"}</p>
      <p><b>Комментарий:</b> {record.comment || "Нет комментариев"}</p>
    </>
  );

  const approveRequest = (id: string) => {
    message.success(`Заявка ${id} одобрена`);
  };

  const rejectRequest = (id: string) => {
    message.error(`Заявка ${id} отклонена`);
  };

  return loading ? <Spin tip="Загрузка заявок..." /> : <Table columns={columns} dataSource={requests} expandable={{ expandedRowRender: expandableRowRender }} pagination={false} />;
};

export default RequestList;
