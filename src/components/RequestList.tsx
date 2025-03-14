import { useState } from "react";
import { Collapse, Button, Input, DatePicker, message, Tag, Select, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;
const PAGE_SIZE = 5;

interface Request {
  id: string;
  fullName: string;
  groupNumber: string;
  reason: string;
  date: string;
  createdAt: string;
  status: string;
  document?: string;
}

const initialRequests: Request[] = [
  { id: "101", fullName: "Иван Иванов", groupNumber: "Б01-123", reason: "Болезнь", date: "2024-03-01", createdAt: "2024-02-25", status: "На проверке", document: "spravka.pdf" },
  { id: "102", fullName: "Мария Смирнова", groupNumber: "Б02-456", reason: "Семейные обстоятельства", date: "2024-02-25", createdAt: "2024-02-20", status: "Одобрено" },
  { id: "103", fullName: "Алексей Кузнецов", groupNumber: "Б03-789", reason: "Командировка", date: "2024-02-20", createdAt: "2024-02-10", status: "Отклонено", document: "komandirovka.pdf" },
  { id: "104", fullName: "Анна Петрова", groupNumber: "Б04-321", reason: "Соревнования", date: "2024-02-18", createdAt: "2024-02-15", status: "На проверке" },
  { id: "105", fullName: "Дмитрий Орлов", groupNumber: "Б01-123", reason: "Семинар", date: "2024-02-28", createdAt: "2024-02-22", status: "Одобрено", document: "seminar.pdf" },
  { id: "106", fullName: "Ольга Сидорова", groupNumber: "Б02-456", reason: "Семейные обстоятельства", date: "2024-03-03", createdAt: "2024-02-27", status: "На проверке" },
  { id: "107", fullName: "Василий Козлов", groupNumber: "Б03-789", reason: "Спортивные сборы", date: "2024-02-26", createdAt: "2024-02-21", status: "Отклонено", document: "sports.pdf" },
  { id: "108", fullName: "Екатерина Белова", groupNumber: "Б05-999", reason: "Олимпиада", date: "2024-03-10", createdAt: "2024-03-01", status: "На проверке" },
  { id: "109", fullName: "Петр Семенов", groupNumber: "Б06-777", reason: "Конференция", date: "2024-03-12", createdAt: "2024-03-02", status: "Одобрено" },];

const RequestCollapseList = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Фильтрация
  const filteredRequests = requests
    .filter((req) => (!statusFilter || req.status === statusFilter))
    .filter((req) => (!groupFilter || req.groupNumber === groupFilter))
    .filter((req) => (!searchName || req.fullName.toLowerCase().includes(searchName.toLowerCase())))
    .filter((req) => !dateFilter || (req.date >= dateFilter[0] && req.date <= dateFilter[1]));

  const paginatedRequests = filteredRequests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Обновление заявки
  const updateRequest = (id: string, updatedData: Partial<Request>) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updatedData } : req))
    );
    message.success("Заявка обновлена!");
    setEditingRequest(null);
  };

  // Удаление
  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    message.success("Заявка удалена!");
  };

  // Одобрение
  const confirmRequest = (id: string) => {
    updateRequest(id, { status: "Одобрено" });
    message.success("Заявка одобрена!");
  };

  // Отклонение
  const rejectRequest = (id: string) => {
    updateRequest(id, { status: "Отклонено" });
    message.error("Заявка отклонена!");
  };

  const exportFilteredRequests = () => {
    if (filteredRequests.length === 0) {
      message.warning("Нет данных для экспорта!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Requests");
    XLSX.writeFile(workbook, "filtered_requests.xlsx");
    message.success("Фильтрованный список пропусков экспортирован!");
  };

  return (
    <div>
      {/* Фильтры */}
      <div style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Select placeholder="Фильтр по статусу" onChange={setStatusFilter} allowClear style={{ width: 180 }}>
          <Option value="На проверке">На проверке</Option>
          <Option value="Одобрено">Одобрено</Option>
          <Option value="Отклонено">Отклонено</Option>
        </Select>
        <Select placeholder="Фильтр по группе" onChange={setGroupFilter} allowClear style={{ width: 180 }}>
          {[...new Set(requests.map((req) => req.groupNumber))].map((group) => (
            <Option key={group} value={group}>{group}</Option>
          ))}
        </Select>
        <Input placeholder="Поиск по ФИО" onChange={(e) => setSearchName(e.target.value)} style={{ width: 200 }} />
        <RangePicker onChange={(dates) => setDateFilter(dates ? [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")] : null)} />
      </div>


      {/* Кнопка экспорта всех заявок */}
      <Button type="primary" icon={<FileExcelOutlined />} onClick={exportFilteredRequests} style={{ marginBottom: 16 }}>
        Экспорт всех заявок
      </Button>

      {/* Список заявок */}
      <Collapse accordion>
        {paginatedRequests.map((req) => (
          <Panel key={req.id} header={`${req.fullName} (${req.groupNumber}) - ${req.reason}`} extra={<Tag color={req.status === "Одобрено" ? "green" : req.status === "Отклонено" ? "red" : "orange"}>{req.status}</Tag>}>
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
                <Button onClick={() => setEditingRequest(null)} style={{ marginLeft: 8 }}>Отмена</Button>
              </>
            ) : (
              <>
                <p><b>Дата пропуска:</b> {req.date}</p>
                <p><b>Дата создания:</b> {req.createdAt}</p>
                <p><b>Документ:</b> {req.document ? <a href={`#${req.document}`} download>{req.document}</a> : "Нет"}</p>

                <Button icon={<EditOutlined />} onClick={() => setEditingRequest(req)} style={{ marginRight: 8 }}>Редактировать</Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => deleteRequest(req.id)} style={{ marginRight: 8 }}>Удалить</Button>
                <Button icon={<CheckCircleOutlined />} type="primary" onClick={() => confirmRequest(req.id)} style={{ marginRight: 8 }}>Одобрить</Button>
                <Button icon={<CloseCircleOutlined />} type="default" danger onClick={() => rejectRequest(req.id)}>Отклонить</Button>
              </>
            )}
          </Panel>
        ))}
      </Collapse>

      {/* Пагинация */}
      <Pagination current={currentPage} total={filteredRequests.length} pageSize={PAGE_SIZE} onChange={setCurrentPage} style={{ marginTop: 16, textAlign: "center" }} />
    </div>
  );
};

export default RequestCollapseList;
