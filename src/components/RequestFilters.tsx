import { DatePicker, Input, Select } from "antd";
import { memo } from "react";

const { Option } = Select;
const { RangePicker } = DatePicker;

export const RequestFilters = memo(function RequestFilters({
  onStatusFilterChange,
  onGroupFilterChange,
  onSearchNameChange,
  onDateFilterChange,
}: {
  onStatusFilterChange: (value: string | null) => void;
  onGroupFilterChange: (value: string | null) => void;
  onSearchNameChange: (value: string) => void;
  onDateFilterChange: (dates: [string, string] | null) => void;
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
        <Option value="На проверке">На проверке</Option>
        <Option value="Одобрено">Одобрено</Option>
        <Option value="Отклонено">Отклонено</Option>
      </Select>
      <Select
        placeholder="Фильтр по группе"
        onChange={onGroupFilterChange}
        allowClear
        style={{ width: "100%" }}
        size="large"
      >
      </Select>
      <Input
        placeholder="Поиск по ФИО"
        onChange={(e) => onSearchNameChange(e.target.value)}
        style={{ width: "100%" }}
        size="large"
      />
      <RangePicker
        onChange={(dates) =>
          onDateFilterChange(
          dates
            ? [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")]
            : null
        )
        }
        style={{ width: "100%" }}
        size="large"
      />
    </div>
  );
});
