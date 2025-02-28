import { Layout } from "antd";
import { ReactElement } from "react";
import CustomContent, { CustomContentProps } from "./CustomContent";
import Navbar, { NavbarProps } from "./Navbar";

export default function PageSceleton({
  navbarProps,
  contentProps,
}: {
  navbarProps: NavbarProps;
  contentProps: CustomContentProps;
}): ReactElement {
  return (
    <Layout style={{ minHeight: "100%" }}>
      <Navbar {...navbarProps} />
      <CustomContent {...contentProps} />
    </Layout>
  );
}
