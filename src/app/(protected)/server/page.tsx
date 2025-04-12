import { UserInfo } from "@/components/user-info";
import { getCurrentUser } from "@/lib/user";

const ServerPage = async () => {
  const user = await getCurrentUser();

  return <UserInfo user={user} label="Server component" />;
};

export default ServerPage;
