import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import DonorHome from "./DonorHome";
import AdminHome from "../Dashboard/AdminHome";
import VolunteerHome from "./VolunteerHome";

export default function DashboardIndex() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (user?.role === "admin") return <AdminHome />;
  if (user?.role === "volunteer") return <VolunteerHome />;

  return <DonorHome />;
}
