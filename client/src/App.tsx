import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Main from "./pages/main";
import Detail from "./pages/detail";
import Dashboard from "./pages/dashboard";
import Protected from "./components/protected";
import Create from "./pages/create";
import Edit from "./pages/edit";

// sadece oturumu açık olan kullanıcıların sayfaya girmesine izin verir.
/* 
const Protected = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  // kullanıcının yetkisi var mı
  return isAuthenticated ? <>{children}</> : <Navigate to={"/login"} />;
};
*/

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* herkes girebilir */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* sadece oturumu açık olan kullanıcılar girebilir */}
        <Route path="/" element={<Protected />}>
          <Route index element={<Main />} />
          <Route path="/shoe/:id" element={<Detail />} />
        </Route>

        {/* sadece rolü admin olan kullanıcılar girebilir */}
        <Route path="/admin" element={<Protected allowedRole="admin" />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<Create />} />
          <Route path="edit/:id" element={<Edit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
