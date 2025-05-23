import { useEffect, useRef, useState, type FC } from "react";
import useUser from "../../hooks/useUser";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const UserInfo: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // custom hook'umuzu kullanarak her yüklenmede kullanıcı bilgisini alıyoruz
  const { user, isLoading } = useUser();

  const { logout } = useAuth();

  // dışarıya tıklanınca dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-end" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img src="/user.svg" className="" />
        <p className="font-semibold text-sm md:text-base max-md:hidden">
          {user?.firstName} {user?.lastName}
        </p>
      </button>

      {isOpen && (
        <div className="absolute -right-4 md:-right-[19px] lg:-right-[23px] bg-fa-white shadow-lg rounded-md mt-10 z-50 flex flex-col items-start">
          <button className="md:hidden p-3 px-6 hover:bg-gray-300/30 transition w-full border-b border-zinc-200 text-start font-semibold">
            {user?.firstName} {user?.lastName}
          </button>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="p-3 px-6 hover:bg-gray-300/30 transition w-full border-b border-zinc-200"
            >
              Admin Paneli
            </Link>
          )}

          <button
            onClick={() => logout.mutate()}
            className="p-3 px-6 hover:bg-gray-300/30 transition cursor-pointer w-full text-start"
          >
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
