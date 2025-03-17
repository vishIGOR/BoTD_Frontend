import { Grid } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { ReactElement } from "react";

export interface AuthPageContentProps {
  children: React.ReactNode;
}
export default function AuthPageContent({
  children,
}: AuthPageContentProps): ReactElement {
  const {lg, sm} = Grid.useBreakpoint();
  return (
    <Content style={{ padding: sm ? "0 48px" : "0 24px", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "white",
          marginTop: sm ? 48 : 24,
          padding: sm ? 24 : 12,
          borderRadius: 8,
          width: lg ? "50%": "100%",
          height: "fit-content",
        }}
      >
        {children}
      </div>
    </Content>
  );
}
