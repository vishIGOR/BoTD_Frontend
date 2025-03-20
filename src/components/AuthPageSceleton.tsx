import { Layout } from "antd";
import { ReactElement } from "react";
import AuthPageContent, { AuthPageContentProps } from "./AuthPageContent";
import Navbar, { NavbarProps } from "./Navbar";

export default function AuthPageSceleton({
  navbarProps,
  contentProps,
  additionalStyle,
}: {
  navbarProps: NavbarProps;
  contentProps: AuthPageContentProps;
  additionalStyle?: React.CSSProperties;
}): ReactElement {
  return (
    <Layout style={{ minHeight: "100%", ...additionalStyle }}>
      <Navbar {...navbarProps} />
      <AuthPageContent {...contentProps} />
    </Layout>
  );
}
