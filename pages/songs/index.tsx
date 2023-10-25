import React from "react";
import { ClientLayout } from "../../components/layouts";
import { useRouter } from "next/router";
import { DataTable } from "../../components/song/data-table";
import { columns } from "../../components/song/columns";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface SongsPageProps {
  id_user: number;
}

const SongsPage: React.FC<SongsPageProps> = ({ id_user }) => {
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
        <DataTable columns={columns} id_user={id_user} />
      </div>
    </ClientLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  console.log(session);

  const id_user = (session as any).user.id;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { id_user },
  };
};

export default SongsPage;
