import { UserProfileProvider } from "./UserProfileContext";

export default function MainProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProfileProvider>{children}</UserProfileProvider>;
}
