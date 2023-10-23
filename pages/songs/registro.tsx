import React from "react";
import { ClientLayout } from "../../components/layouts";
import { useRouter } from "next/router";
import Link from "next/link";

import { useForm } from "react-hook-form";

import { useContext, useState } from "react";
import { signIn, getSession } from "next-auth/react";

import Image from "next/image";

import { AuthContext } from "../../context/auth";
import {
  isEmail,
  isValidCurp,
  isValidPhone,
  isValidRfc,
} from "../../utils/validations";
import { GetServerSideProps } from "next";
import { exampleApi } from "../../api";
import Swal from "sweetalert2";

const UsuariosRegisterPage = () => {
  const router = useRouter();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linklist, setLinklist] = useState<{ url: string }[]>([]);
  const [showLinkError, setShowLinkError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onRegisterForm = async ({ ...form_data }: any) => {
    setShowError(false);
    setShowLinkError(false);

    linklist.length === 0 && setShowLinkError(true);
    console.log(linklist);

    return;

    try {
      await exampleApi.post("/song/register", { ...form_data });

      // La llamada a la API se realizó con éxito, mostramos la alerta de SweetAlert2
      await Swal.fire({
        title: "¡Registro exitoso!",
        text: "El registro se ha completado correctamente.",
        icon: "success",
        confirmButtonText: "Ok",
        allowOutsideClick: false, // Evitar que la alerta se cierre al hacer clic fuera de ella
      });
      reset();
      // Redireccionar a otra página una vez que el usuario cierra la alerta de éxito
      router.push("/songs");
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
    <ClientLayout title="Registro de canciones">
      <h1 className="text-5xl mb-5">Registrar canción</h1>

      <div className="flex flex-row justify-center">
        <div className="max-w-6xl w-full p-6 bg-white shadow-lg rounded-lg border-2 border-gray-300">
          <h2 className="text-center text-2xl font-bold mb-6">Registro</h2>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onRegisterForm)}
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
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  console.log(session);

  const role = (session as any).user.role;

  console.log(role);

  if (role !== "a") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default UsuariosRegisterPage;
