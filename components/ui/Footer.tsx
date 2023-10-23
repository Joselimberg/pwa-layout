export const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-8xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full flex-none sm:w-auto">
            <p className="text-white">
              © 2023 Mi Empresa. Todos los derechos reservados.
            </p>
          </div>
          <div className="w-full mt-4 sm:w-auto sm:mt-0">
            <ul className="flex justify-center space-x-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Instagram
                </a>
              </li>
              {/* Agrega más enlaces de redes sociales aquí */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
