import { DatePicker, Input, Select } from "antd";
import { memo } from "react";
import { Status } from "../models/Request";

const { Option } = Select;
const { RangePicker } = DatePicker;

export const RequestFilters = memo(function RequestFilters({
  onStatusFilterChange,
  onGroupFilterChange,
  onSearchNameChange,
  onDateFilterChange,
}: {
  onStatusFilterChange: (value: Status | null) => void;
  onGroupFilterChange: (value: string | null) => void;
  onSearchNameChange: (value: string) => void;
  onDateFilterChange: (dates: [Date | null, Date | null] | null) => void;
}) {
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
        <Option value="DECLINDE">Отклонено</Option>
      </Select>
      <Select
        placeholder="Фильтр по группе"
        onChange={onGroupFilterChange}
        allowClear
        style={{ width: "100%" }}
        size="large"
      ></Select>
      <Input
        placeholder="Поиск по ФИО"
        onChange={(e) => onSearchNameChange(e.target.value)}
        style={{ width: "100%" }}
        size="large"
      />
      <RangePicker
        allowEmpty={[true, true]}
        placeholder={["Начало", "Конец"]}
        onChange={(dates) =>
          onDateFilterChange(
            dates?.[0] || dates?.[1]
              ? [dates[0]?.toDate() || null, dates[1]?.toDate() || null]
              : null
          )
        }
        style={{ width: "100%" }}
        size="large"
      />
    </div>
  );
});
