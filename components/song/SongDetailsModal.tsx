import Modal from "react-modal";
import { ISong } from "../../interfaces/song";

interface ClientDetailsModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  selectedRecord: ISong | null;
}

const SongDetailsModal: React.FC<ClientDetailsModalProps> = ({
  showModal,
  onCloseModal,
  selectedRecord,
}) => {
  const links = selectedRecord?.links;
  return (
    <Modal
      isOpen={showModal}
      onRequestClose={onCloseModal}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "400px", // Ajusta el ancho según tu preferencia
          height: "auto", // Ajusta la altura según tu preferencia o usa 'auto' para adaptarse al contenido
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      {/* Contenido del modal con la información del registro */}
      <div className="flex flex-col mx-1">
        <h2 className="text-3xl mb-5">Enlaces</h2>
        {links && links?.length > 0 ? (
          <ul>
            {links.map((link, index) => (
              <>
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900"
                  >
                    {link.url}
                  </a>
                </li>
                <br />
              </>
            ))}
          </ul>
        ) : (
          <>"No hay enlaces para mostrar"</>
        )}
        {/* Agregar más campos según tus necesidades */}
      </div>
    </Modal>
  );
};

export default SongDetailsModal;
