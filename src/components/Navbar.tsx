import { Layout, Space } from "antd";
import { ReactElement } from "react";

const { Header } = Layout;

export interface NavbarProps {
  leftButtons: ReactElement;
  rightButtons: ReactElement;
}

export default function Navbar({
  leftButtons,
  rightButtons,
}: NavbarProps): ReactElement {
  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Space>{leftButtons}</Space>
      <Space>{rightButtons}</Space>
    </Header>
  );
}
