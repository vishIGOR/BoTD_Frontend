import { Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { ReactElement } from "react";

export interface MainPageContentProps {
  breadcrumbItems: { title: string; href?: string }[];
  children: React.ReactNode;
}
export default function MainPageContent({
  breadcrumbItems,
  children,
}: MainPageContentProps): ReactElement {
  return (
    <Content style={{ padding: "0 48px" }}>
      <Breadcrumb style={{ margin: "16px 0", }} items={breadcrumbItems} />
      <div
        style={{
          background: "white",
          minHeight: 280,
          padding: 24,
          borderRadius: 8,
        }}
      >
        {children}
      </div>
    </Content>
  );
}
