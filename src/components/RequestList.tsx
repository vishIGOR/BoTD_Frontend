import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Collapse, message, Pagination, Skeleton, Tag } from "antd";
import { useEffect, useState } from "react";
import { useUserProfileContext } from "../context/UserProfileContext";
import { reasonToString, Request, statusToString } from "../models/Request";
import {
  editRequest,
  exportRequests,
  exportUserRequests,
  getRequests,
  getUserRequests,
} from "../utils/requests";
import ControlMenu from "./ControlMenu";
import EditRequestForm from "./EditRequestForm";
import { RequestFilters } from "./RequestFilters";
import UploadDocumentsForm from "./UploadDocumentsForm";

const { Panel } = Collapse;
const PAGE_SIZE = 10;

const RequestCollapseList = () => {
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [isUploadingFormOpem, setIsUploadingFormOpen] = useState(false);
  const [uploadingRequestId, setUploadingRequestId] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<
    [Date | null, Date | null] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportDownloading, setExportDownloading] = useState(false);

  const { userProfile } = useUserProfileContext();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (userProfile.role === "STUDENT") {
          getUserRequests(userProfile.id, {}).then((response) => {
            setRequests(response);
            setRequestsLoading(false);
          });
        } else {
          getRequests({}).then((response) => {
            setRequests(response);
            setRequestsLoading(false);
          });
        }
      } catch {
        message.error("Ошибка при получении запросов");
      }
    };

    fetchRequests();
  }, []);

  // Фильтрация
  const filteredRequests = requests
    .filter((req) => !statusFilter || req.status === statusFilter)
    .filter((req) => !groupFilter || req.groupNumber === groupFilter)
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
  const editRequestLocally = (id: string, updatedData: Partial<Request>) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updatedData } : req))
    );
    setEditingRequest(null);
  };

  // Одобрение
  const confirmRequest = (id: string) => {
    const request = requests.find((req) => req.id === id);

    if (!request) {
      message.error("Заявка не найдена");
      return;
    }

    try {
      editRequest(id, {
        ...request,
        status: "APPROVED",
        creatorId: request.creator.id,
      });
    } catch {
      message.error("Не удалось одобрить заявку");
      return;
    }
    editRequestLocally(id, { status: "APPROVED" });
    message.success("Заявка одобрена");
  };

  // Отклонение
  const rejectRequest = (id: string) => {
    const request = requests.find((req) => req.id === id);

    if (!request) {
      message.error("Заявка не найдена");
      return;
    }

    try {
      editRequest(id, {
        ...request,
        status: "DECLINED",
        creatorId: request.creator.id,
      });
    } catch {
      message.error("Не удалось отклонить заявку");
      return;
    }
    editRequestLocally(id, { status: "DECLINED" });
    message.success("Заявка отклонена");
  };

  // Экспорт
  const exportFilteredRequests = async () => {
    setExportDownloading(true);
    try {
      let file: Blob | null = null;
      if (userProfile.role === "STUDENT") {
        file = await exportUserRequests(userProfile.id, {});
      } else {
        file = await exportRequests({});
      }

      console.log("file", file);
      const url = URL.createObjectURL(file);

      // Create a hidden anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = "Документы_заявок";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      message.error("Произошла ошибка при экспорте");
    } finally {
      setExportDownloading(false);
    }
  };

  return (
    <>
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
            onCreateCallback={(request: Request) =>
              setRequests([...requests, request])
            }
            exportDownloading={exportDownloading}
          />
        </div>

        {/* Список заявок */}
        {requestsLoading ? (
          <Skeleton active />
        ) : (
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
                        : req.status === "DECLINED"
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
                  {req.moderator && (
                    <p>
                      <b>Вердикт пользователя:</b> {req.moderator.name}
                    </p>
                  )}

                  <Button
                    icon={<EditOutlined />}
                    onClick={async () => {
                      setEditingRequest(req);
                      setTimeout(() => {
                        setIsEditingModalOpen(true);
                      }, 0);
                    }}
                    style={{ marginRight: 8, marginBottom: 8 }}
                    size="large"
                  >
                    Редактировать общие данные
                  </Button>
                  <Button
                    icon={<UploadOutlined />}
                    onClick={async () => {
                      setUploadingRequestId(req.id);
                      setTimeout(() => {
                        setIsUploadingFormOpen(true);
                      }, 0);
                    }}
                    style={{ marginRight: 8, marginBottom: 8 }}
                    size="large"
                  >
                    Прикрепить документы
                  </Button>
                  {(userProfile.role === "ADMIN" ||
                    userProfile.role === "DEAN") && (
                    <>
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
                  )}
                </>
              </Panel>
            ))}
          </Collapse>
        )}

        {/* Пагинация */}
        <Pagination
          current={currentPage}
          total={filteredRequests.length}
          pageSize={PAGE_SIZE}
          onChange={setCurrentPage}
          style={{ marginTop: 16, textAlign: "center" }}
        />
      </div>
      {editingRequest && (
        <EditRequestForm
          isModalOpen={isEditingModalOpen}
          setIsModalOpen={setIsEditingModalOpen}
          request={editingRequest}
          onEditCallback={(request: Request) => {
            setEditingRequest(null);
            setIsEditingModalOpen(false);
            setRequests((prev) =>
              prev.map((oldRequest) =>
                oldRequest.id === request.id ? request : oldRequest
              )
            );
          }}
        />
      )}
      {uploadingRequestId && (
        <UploadDocumentsForm
          isModalOpen={isUploadingFormOpem}
          setIsModalOpen={setIsUploadingFormOpen}
          requestId={uploadingRequestId}
          onUploadCallback={() => {
            setUploadingRequestId(null);
            setIsUploadingFormOpen(false);
          }}
        />
      )}
    </>
  );
};

export default RequestCollapseList;
