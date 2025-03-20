import { Layout } from "antd";
import { ReactElement } from "react";
import MainPageContent, { MainPageContentProps } from "./MainPageContent";
import Navbar, { NavbarProps } from "./Navbar";

export default function MainPageSceleton({
  navbarProps,
  contentProps,
  additionalStyle,
}: {
  navbarProps: NavbarProps;
  contentProps: MainPageContentProps;
  additionalStyle?: React.CSSProperties;
}): ReactElement {
  return (
    <Layout style={{ minHeight: "100%", ...additionalStyle }}>
      <Navbar {...navbarProps} />
      <MainPageContent {...contentProps} />
    </Layout>
  );
}
