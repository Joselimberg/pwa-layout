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

const SongEditModal: React.FC<SongEditModalProps> = ({
  showModal,
  onCloseModal,
  selectedRecord,
}) => {
  const router = useRouter();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linklist, setLinklist] = useState<{ url: string }[]>(
    selectedRecord?.links as any
  );
  const [showLinkError, setShowLinkError] = useState(false);
  const { data } = useSession();

  const id_user = (data?.user as any).id
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
      name: selectedRecord?.name,
      level: selectedRecord?.level,
      artist: selectedRecord?.artist?.name,
      links: "",
    },
  });

  const handleDeleteSong = async () => {
    // Mostrar la alerta de confirmación al usuario
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este pago.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    // Si el usuario confirma, proceder con la eliminación
    if (result.isConfirmed) {
      try {
        // Obtener el ID del pago seleccionado
        const pagoId = selectedRecord?.id;

        await exampleApi.delete(`/song/delete/${pagoId}`);

        // Mostrar una alerta de éxito
        await Swal.fire({
          title: "¡Eliminación exitosa!",
          text: "El pago se ha eliminado correctamente.",
          icon: "success",
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        });

        // Cerrar el modal o realizar otras lógicas después de la eliminación...
      } catch (error) {
        // Mostrar una alerta de error si la eliminación falla
        await Swal.fire({
          title: "Error",
          text: "Ha ocurrido un error al eliminar el pago.",
          icon: "error",
          confirmButtonText: "Ok",
          allowOutsideClick: false,
        });
      }
      router.reload();
    }
  };

  const onUpdateForm = async ({ ...form_data }: any) => {
    setShowError(false);
    setShowLinkError(false);

    if (linklist.length === 0) {
      setShowLinkError(true);
      return;
    }

    try {
      // Utilizar la ruta y el método adecuados para la actualización del pago
      await exampleApi.put(`/song/update/${selectedRecord?.id}`, {
        ...form_data,
        linklist,
        id_user
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

  const addLink = (data: string) => {
    if (data.trim() !== "") {
      const newLink = { url: data };
      setLinklist((prevLinkList) => [...prevLinkList, newLink]);
      // Limpiar el campo de entrada después de agregar un enlace
      setValue("links", "");
    }
  };

  const removeLink = (indexToRemove: number) => {
    setLinklist((prevLinkList) =>
      prevLinkList.filter((_, index) => index !== indexToRemove)
    );
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
      <h1 className="text-5xl mb-5">Actualizar canción</h1>

      <div className="flex flex-row justify-center">
        <div className="max-w-6xl w-full p-6 bg-white shadow-lg rounded-lg border-2 border-gray-300">
          <h2 className="text-center text-2xl font-bold mb-6">Editar</h2>
          <div className="flex flex-row justify-center">
            <button
              className="btn-primary px-5 text-base bg-red-500 text-white hover:bg-red-800 mb-3"
              onClick={handleDeleteSong}
            >
              Eliminar Pago
            </button>
          </div>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onUpdateForm)}
            noValidate
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col md:w-1/2 flex-grow flex-shrink-0 px-1">
                <div>
                  {/* Nombre */}
                  <label htmlFor="name" className="block text-lg">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
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

                <div>
                  {/* Artista */}
                  <label htmlFor="artist" className="block text-lg">
                    Artista
                  </label>
                  <input
                    type="text"
                    id="artist"
                    className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                    placeholder="Artista"
                    {...register("artist", {
                      required: "Ingrese un valor válido",
                    })}
                  />
                </div>
                {!!errors.artist ? (
                  <div className="mb-4">
                    <span className="text-red-700">
                      {errors.artist.message}
                    </span>
                  </div>
                ) : (
                  <div className="mb-4"></div>
                )}

                <div>
                  {/* Nivel */}
                  <label htmlFor="level" className="block text-lg">
                    Nivel: {watch("level")}
                  </label>
                  <input
                    type="range"
                    id="level"
                    min="1"
                    max="5"
                    defaultValue="1"
                    step="1"
                    className="form-range w-full"
                    {...register("level", {
                      required: "Seleccione un nivel",
                    })}
                  />
                  <div className="flex justify-between">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
                {!!errors.level ? (
                  <div className="mb-4">
                    <span className="text-red-700">{errors.level.message}</span>
                  </div>
                ) : (
                  <div className="mb-4"></div>
                )}
              </div>

              {/* este div */}
              <div className="flex flex-col  md:w-1/2 flex-grow flex-shrink-0 px-1 mt-4 md:mt-0">
                <div>
                  {/* Links */}
                  <label htmlFor="links" className="block text-lg">
                    Links
                  </label>
                  <input
                    type="text"
                    id="links"
                    className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                    placeholder="Links"
                    {...register("links", {})}
                    onChange={(e) => setValue("links", e.target.value)}
                  />
                  {!!showLinkError ? (
                    <div className="mb-4">
                      <span className="text-red-700">
                        Debe agregar al menos un enlace
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4"></div>
                  )}
                  <button
                    type="button"
                    onClick={() => addLink(watch("links"))}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Agregar Enlace
                  </button>

                  <div className="form-input w-full border-2 border-gray-300 rounded px-1 py-1">
                    {linklist.map((link, index) => (
                      <div className="flex flex-row border" key={index}>
                        <button
                          className="bg-red-500 text-white px-4 py-2 mx-5 my-3 rounded"
                          onClick={() => removeLink(index)}
                        >
                          Eliminar
                        </button>
                        <div className="overflow-y-scroll h-16">
                          <span>{link.url}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {showError ? (
              <div className="">
                <p className="text-red-700 fs-5 text-center">{errorMessage}</p>
                <hr className="border-2 border-red-700" />
              </div>
            ) : (
              <></>
            )}
            {/* Botón de Registrar */}
            <div className="flex flex-row justify-center">
              <button
                type="submit"
                className="btn-primary py-2 px-6 w-full md:w-2/6  text-lg bg-blue-500 text-white hover:bg-green-500"
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

export default SongEditModal;
