import Modal from "react-modal";
import { exampleApi } from "../../api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";
import { ISong } from "../../interfaces";
import { useSession } from "next-auth/react";

interface SongEditModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  selectedRecord: ISong | null;
}

const ArtistEditModal: React.FC<SongEditModalProps> = ({
  showModal,
  onCloseModal,
  selectedRecord,
}) => {
  const router = useRouter();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data } = useSession();

  const id_user = (data?.user as any).id;
  console.log(id_user);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: selectedRecord?.artist.name,
    },
  });

  const onUpdateForm = async ({ ...form_data }: any) => {
    setShowError(false);

    try {
      // Utilizar la ruta y el método adecuados para la actualización del pago
      await exampleApi.put(`/artist/update/${selectedRecord?.id_artist}`, {
        ...form_data,
        id_user,
      });

      // La llamada a la API se realizó con éxito, mostramos la alerta de SweetAlert2
      await Swal.fire({
        title: "¡Actualización exitosa!",
        text: "El pago se ha actualizado correctamente.",
        icon: "success",
        confirmButtonText: "Ok",
        allowOutsideClick: false, // Evitar que la alerta se cierre al hacer clic fuera de ella
      });

      // Restablecer los campos del formulario a sus valores predeterminados
      reset();
      // Cerrar el modal
      onCloseModal();
      // Redireccionar a otra página u realizar otras lógicas después de la actualización...
      router.reload();
    } catch (error) {
      setShowError(true);
      console.log(error);
      setErrorMessage((error as any).response.data.message);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={onCloseModal}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "100%", // Ajusta el ancho según tu preferencia
          height: "80%", // Ajusta la altura según tu preferencia o usa 'auto' para adaptarse al contenido
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <h1 className="text-5xl mb-5">Actualizar artista</h1>

      <div className="flex flex-row justify-center">
        <div className="max-w-6xl w-full p-6 bg-white shadow-lg rounded-lg border-2 border-gray-300">
          <h2 className="text-center text-2xl font-bold mb-6">Editar</h2>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onUpdateForm)}
            noValidate
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-row justify-center flex-grow flex-shrink-0 px-1">
                <div>
                  {/* Nombre */}
                  <label htmlFor="name" className="block text-lg">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input w-80 border-2 border-gray-300 rounded px-1 py-1"
                    placeholder="Nombre"
                    {...register("name", {
                      required: "Ingrese un valor válido",
                    })}
                  />
                </div>
                {!!errors.name ? (
                  <div className="mb-4">
                    <span className="text-red-700">{errors.name.message}</span>
                  </div>
                ) : (
                  <div className="mb-4"></div>
                )}
              </div>

              {/* este div */}
            </div>
            {showError ? (
              <div className="">
                <p className="text-red-700 fs-5 text-center">{errorMessage}</p>
                <hr className="border-2 border-red-700" />
              </div>
            ) : (
              <></>
            )}
            <p className="text-center">
              OJO, Si cambia el nombre del artista, se cambiará para todas sus
              canciones asignadas
            </p>
            {/* Botón de Registrar */}
            <div className="flex flex-row justify-center">
              <button
                type="submit"
                className="btn-primary py-2 px-6 w-full md:w-1/6  text-lg bg-blue-500 text-white hover:bg-green-500"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ArtistEditModal;
