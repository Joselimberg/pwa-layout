import React from "react";
import { AuthLayout } from "../../components/layouts";
import Link from "next/link";

import { useForm } from "react-hook-form";

import { useContext, useState } from "react";
import { signIn, getSession } from "next-auth/react";

import Image from "next/image";

import { AuthContext } from "../../context/auth";
import { isEmail } from "../../utils/validations";
import { GetServerSideProps } from "next";

const Register = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { registerUser } = useContext(AuthContext);

  const onRegisterForm = async ({ name, email, password }: any) => {
    setShowError(false);
    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    await signIn("credentials", { email, password });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <AuthLayout title="Registro">
      <div className="flex justify-center items-center h-5/6">
        <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border-2 border-gray-300">
          <h2 className="text-center text-2xl font-bold mb-6">Registro</h2>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onRegisterForm)}
            noValidate
          >
            <div>
              {/* Nombre */}
              <label htmlFor="name" className="block text-lg">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                placeholder="Ingresa tu nombre"
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
              {/* Correo */}
              <label htmlFor="email" className="block text-lg">
                Correo
              </label>
              <input
                type="email"
                id="email"
                className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                placeholder="Ingresa tu correo"
                {...register("email", {
                  required: "Ingrese un valor válido",
                  validate: isEmail,
                })}
              />
            </div>
            {!!errors.email ? (
              <div className="mb-4">
                <span className="text-red-700">{errors.email.message}</span>
              </div>
            ) : (
              <div className="mb-4"></div>
            )}
            <div>
              {/* Verificar Correo */}
              <label htmlFor="confirmEmail" className="block text-lg">
                Verificar Correo
              </label>
              <input
                type="email"
                id="confirmEmail"
                className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                placeholder="Vuelve a ingresar tu correo"
                {...register("confemail", {
                  required: "Ingrese un valor válido",
                  validate: (value) => {
                    if (value !== watch("email"))
                      return "El correo no coincide";
                  },
                })}
              />
            </div>
            {!!errors.confemail ? (
              <div className="mb-4">
                <span className="text-red-700">{errors.confemail.message}</span>
              </div>
            ) : (
              <div className="mb-4"></div>
            )}
            <div>
              {/* Contraseña */}
              <label htmlFor="password" className="block text-lg">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                placeholder="Ingresa tu contraseña"
                {...register("password", {
                  required: "Ingrese un valor válido",
                })}
              />
            </div>
            {!!errors.password ? (
              <div className="mb-4">
                <span className="text-red-700">{errors.password.message}</span>
              </div>
            ) : (
              <div className="mb-4"></div>
            )}

            <div>
              {/* Verificar Contraseña */}
              <label htmlFor="confirmPassword" className="block text-lg">
                Verificar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                placeholder="Vuelve a ingresar tu contraseña"
                {...register("confpassword", {
                  required: "Ingrese un valor válido",
                  validate: (value) => {
                    if (value !== watch("password"))
                      return "La contraseña no coincide";
                  },
                })}
              />
            </div>
            {!!errors.confpassword ? (
              <div className="mb-4">
                <span className="text-red-700">
                  {errors.confpassword.message}
                </span>
              </div>
            ) : (
              <div className="mb-4"></div>
            )}

            {showError ? (
              <div className="">
                <p className="text-red-700 fs-5">{errorMessage}</p>
              </div>
            ) : (
              <></>
            )}
            <div>
              {/* Botón de Registrar */}
              <button
                type="submit"
                className="btn-primary py-2 px-6 w-full text-lg bg-blue-500 text-white hover:bg-green-500"
              >
                Registrar
              </button>
            </div>
            <div className="text-center text-lg">
              {/* Enlace para iniciar sesión */}
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="text-blue-500 font-bold">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
  const session = await getSession({ req });
  // console.log({session});

  

  if ( session ) {
      return {
          redirect: {
              destination: '/',
              permanent: false
          }
      }
  }


  return {
      props: { }
  }
}

export default Register;
