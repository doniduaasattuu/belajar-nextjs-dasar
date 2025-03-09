import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status == "authenticated") {
      router.push("/todolists");
    } else {
      router.push("/auth/login");
    }
  }, [status, router]);

  return null;
};

export default Dashboard;
