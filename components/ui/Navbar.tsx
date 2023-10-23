import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { AuthContext } from "../../context/auth";

export const Navbar = () => {
  const { data } = useSession();
  const { logout } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const router = useRouter();

  return (
    <nav className="bg-gray-800">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                Logo
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Inicio
                </Link>
                <Link
                  href="/songs"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Canciones
                </Link>
                {/* Agrega más enlaces aquí */}
              </div>
            </div>
          </div>
          {/* Menú responsivo */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium"
            >
              Menu
            </button>
          </div>
          {/* Botón de logout en la vista de escritorio */}
          {data ? (
            <div className="hidden md:block">
              <button
                onClick={logout}
                className="bg-red-700 text-white rounded-lg p-2"
                style={{ width: "100px" }}
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <button
                onClick={() => {
                  router.push("/auth/login");
                }}
                className="bg-green-600 text-white rounded-lg p-2"
                style={{ width: "150px" }}
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Menú responsivo */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-xl font-medium text-center"
            >
              Inicio
            </Link>
            <Link
              href="/songs"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-xl font-medium text-center"
            >
              Canciones
            </Link>
            {data ? (
              <div className="flex justify-end">
                <button
                  onClick={logout}
                  className="bg-red-700 text-white rounded-lg p-2 mt-5"
                  style={{ width: "100px" }}
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                  className="bg-green-700 text-white rounded-lg p-2 mt-5"
                  style={{ width: "100px" }}
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
            {/* Agrega más enlaces aquí */}
          </div>
        </div>
      )}
    </nav>
  );
};
