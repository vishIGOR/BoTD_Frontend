import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Collapse, message, Pagination, Tag } from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { reasonToString, Request, statusToString } from "../models/Request";
import { getRequests } from "../utils/requests";
import ControlMenu from "./ControlMenu";
import { RequestFilters } from "./RequestFilters";

const { Panel } = Collapse;
const PAGE_SIZE = 5;

const RequestCollapseList = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<
    [Date | null, Date | null] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        getRequests({}).then((response) => {
          setRequests(response);
        });
      } catch {
        message.error("Ошибка при получении запросов");
      }
    };

    fetchRequests();
  }, []);

  // Фильтрация
  const filteredRequests = requests
    .filter((req) => !statusFilter || req.status === statusFilter)
    // .filter((req) => !groupFilter || req.groupNumber === groupFilter)
    .filter(
      (req) =>
        !searchName ||
        req.creator.name.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((req) => (dateFilter?.[0] ? req.dateStart >= dateFilter[0] : true))
    .filter((req) => (dateFilter?.[1] ? req.dateEnd <= dateFilter[1] : true));

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
    updateRequest(id, { status: "APPROVED" });
    message.success("Заявка одобрена!");
  };

  // Отклонение
  const rejectRequest = (id: string) => {
    updateRequest(id, { status: "DECLINDE" });
    message.error("Заявка отклонена!");
  };

  // Экспорт
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
      {/* Верхняя часть: Фильтры и кнопки */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <RequestFilters
          onStatusFilterChange={setStatusFilter}
          onGroupFilterChange={setGroupFilter}
          onSearchNameChange={setSearchName}
          onDateFilterChange={setDateFilter}
        />
        <ControlMenu
          onExportClick={exportFilteredRequests}
          onCreateClick={() => console.log("Open modal for new request")}
        />
      </div>

      {/* Список заявок */}
      <Collapse accordion>
        {paginatedRequests.map((req) => (
          <Panel
            key={req.id}
            header={`${req.creator.name} - ${reasonToString(req.reason)}`}
            extra={
              <Tag
                color={
                  req.status === "APPROVED"
                    ? "green"
                    : req.status === "DECLINDE"
                    ? "red"
                    : "orange"
                }
              >
                {statusToString(req.status)}
              </Tag>
            }
          >
            <>
              <p>
                <b>Описание:</b> {req.comment}
              </p>
              <p>
                <b>Дата пропуска:</b>
                {` ${req.dateStart.toLocaleDateString()} - ${req.dateEnd.toLocaleDateString()}`}
              </p>
              <p>
                <b>Дата создания:</b> {req.createdAt.toLocaleDateString()}
              </p>
              <p>
                <b>Документы в деканате:</b> {req.fileInDean ? "Да" : "Нет"}
              </p>
              <p>
                <b>Документ:</b>{" "}
                {/* {req.document ? (
                    <a href={`#${req.document}`} download>
                      {req.document}
                    </a>
                  ) : (
                    "Нет"
                  )} */}
              </p>
              {req.moderator && (
                <p>
                  <b>Вердикт пользователя:</b> {req.moderator.name}
                </p>
              )}

              <Button
                icon={<EditOutlined />}
                onClick={() => setEditingRequest(req)}
                style={{ marginRight: 8, marginBottom: 8 }}
                size="large"
              >
                Редактировать
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => deleteRequest(req.id)}
                style={{ marginRight: 8, marginBottom: 8 }}
                size="large"
              >
                Удалить
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                type="primary"
                onClick={() => confirmRequest(req.id)}
                style={{ marginRight: 8, marginBottom: 8 }}
                size="large"
              >
                Одобрить
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                type="default"
                danger
                onClick={() => rejectRequest(req.id)}
                style={{ marginRight: 8, marginBottom: 8 }}
                size="large"
              >
                Отклонить
              </Button>
            </>
          </Panel>
        ))}
      </Collapse>

      {/* Пагинация */}
      <Pagination
        current={currentPage}
        total={filteredRequests.length}
        pageSize={PAGE_SIZE}
        onChange={setCurrentPage}
        style={{ marginTop: 16, textAlign: "center" }}
      />
    </div>
  );
};

export default RequestCollapseList;
