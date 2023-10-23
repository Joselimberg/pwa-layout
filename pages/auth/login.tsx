import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts";
import { isEmail } from "../../utils/validations";
import { GetServerSideProps } from "next";

const Login = () => {
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onLoginUser = async ({ email, password }: any) => {
    setShowError(false);

    const resp: any = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (resp.ok) {
      router.push("/");
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      <div className="flex justify-center items-center h-5/6">
        <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border-2 border-gray-300">
          <h2 className="text-center text-2xl font-bold mb-6">
            Iniciar Sesión
          </h2>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onLoginUser)}
            noValidate
          >
            <div>
              {/* Correo */}
              {showError ? (
                <div className="">
                  <p className="text-red-700 text-center fs-5">
                    Error al iniciar sesión *{" "}
                  </p>
                </div>
              ) : (
                <></>
              )}
              <label htmlFor="email" className="block text-lg">
                Correo
              </label>
              <input
                type="email"
                id="email"
                className="form-input w-full border-2 border-gray-300 rounded px-1 py-1"
                placeholder="Ingresa tu correo"
                {...register("email", {
                  required: "Ingrese un correo válido",
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
                  required: "Ingrese una contraseña válida",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
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
              {/* Botón de Ingresar */}
              <button
                type="submit"
                className="btn-primary py-2 px-6 w-full text-lg bg-blue-500 text-white hover:bg-green-500"
              >
                Ingresar
              </button>
            </div>
            <div className="text-center text-lg">
              {/* Enlace para registrarse */}
              ¿No estás registrado?{" "}
              <Link href="/auth/register" className="text-blue-500 font-bold">
                Crea una cuenta
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

export default Login;
