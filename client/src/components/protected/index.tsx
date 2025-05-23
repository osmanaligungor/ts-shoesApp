import type { FC } from "react";
import useUser from "../../hooks/useUser";
import Loader from "../loader";
import { Navigate } from "react-router-dom";
import Layout from "../layout";

interface Props {
  allowedRole?: "user" | "admin";
}

const Protected: FC<Props> = ({ allowedRole }) => {
  const { user, isLoading, isAuthenticated } = useUser();

  // kullanıcının oturumu kapalıysa logine yönlendirir
  if (!isAuthenticated) return <Navigate to="/login" />;

  // kullanıcının oturumu açık ve role özel bir sayfa değilse sayfayı direkt gösteriyoruz
  if (isAuthenticated && !allowedRole)
    return (
      <div>
        <Layout />
      </div>
    );

  // role özel bir sayfa varsa o zaman kullanıcı yüklenene kadar loader yükle
  if (allowedRole && isLoading) return <Loader />;

  // kullanıcının rolü izin verilen role eşitse o zaman sayfayı göster
  if (user?.role === allowedRole)
    return (
      <div>
        <Layout />
      </div>
    );

  // kullanıcının rolü yeterli değilse anasayfaya at
  return <Navigate to="/" />;
};

export default Protected;
