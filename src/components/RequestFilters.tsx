import { DatePicker, Input, message, Select } from "antd";
import { memo, useEffect, useState } from "react";
import { Status } from "../models/Request";
import { useUserProfileContext } from "../context/UserProfileContext";
import { getGroups } from "../utils/requests";

const { Option } = Select;
const { RangePicker } = DatePicker;

export const RequestFilters = memo(function RequestFilters({
  onStatusFilterChange,
  onGroupFilterChange,
  onSearchNameChange,
  onDateFilterChange,
}: {
  onStatusFilterChange: (value: Status | null) => void;
  onGroupFilterChange: (value: number | null) => void;
  onSearchNameChange: (value: string) => void;
  onDateFilterChange: (dates: [Date | null, Date | null] | null) => void;
}) {
  const { userProfile } = useUserProfileContext();
  const [groups, setGroups] = useState<{ number: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile.role !== "STUDENT") {
      setLoading(true);
      getGroups()
        .then((data) => {
          setGroups(data);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке групп:", error);
          message.error("Не удалось загрузить группы.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userProfile.role]);

  return (
    <div
      style={{
        flex: 7,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        padding: 16,
        border: "1px solid #d9d9d9",
        borderRadius: 8,
      }}
    >
      <Select
        placeholder="Фильтр по статусу"
        onChange={onStatusFilterChange}
        allowClear
        style={{ width: "100%" }}
        size="large"
      >
        <Option value="PENDING">На проверке</Option>
        <Option value="APPROVED">Одобрено</Option>
        <Option value="DECLINED">Отклонено</Option>
      </Select>
      {userProfile.role !== "STUDENT" && (
        <>
          <Select
            placeholder="Фильтр по группе"
            onChange={onGroupFilterChange}
            allowClear
            style={{ width: "100%" }}
            size="large"
            loading={loading}
          >
            {groups.map((group) => (
              <Option key={group.number} value={group.number}>
                {group.number}
              </Option>
            ))}
          </Select>
          <Input
            placeholder="Поиск по ФИО"
            onChange={(e) => onSearchNameChange(e.target.value)}
            style={{ width: "100%" }}
            size="large"
          />
        </>
      )}
      <RangePicker
        allowEmpty={[true, true]}
        placeholder={["Начало пропуска", "Конец пропуска"]}
        onChange={(dates) =>
          onDateFilterChange(
            dates?.[0] || dates?.[1]
              ? [dates[0]?.toDate() || null, dates[1]?.toDate() || null]
              : null
          )
        }
        style={{ width: "100%", height: 40 }}
        size="large"
      />
    </div>
  );
});
