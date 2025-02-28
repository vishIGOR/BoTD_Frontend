import { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function NavbarLinkButton({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}): ReactElement {
  return <Link style={{ color: "white" }} to={path}>{children}</Link>;
}
