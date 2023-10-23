import React from "react";
import { ClientLayout } from "../../components/layouts";
import { useRouter } from "next/router";
import { DataTable } from "../../components/song/data-table";
import { columns } from "../../components/song/columns";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

const SongsPage = () => {
  const router = useRouter();
  return (
    <ClientLayout title="Clientes">
      <h1 className="text-5xl mb-5">Control de canciones</h1>

      <div className="flex flex-row justify-start ">
        <button
          className="btn-primary py-2 px-6 text-3xl bg-blue-500 text-white hover:bg-green-500"
          onClick={() => {
            router.push("./songs/registro");
          }}
        >
          Registrar
        </button>
      </div>
      <div className="flex flex-row justify-start border overflow-x-scroll mt-2">
        <DataTable columns={columns} />
      </div>
    </ClientLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  console.log(session);

  const role = (session as any).user.role;

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

export default SongsPage;
