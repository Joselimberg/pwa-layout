import { ISong } from "../../interfaces";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ISong>[] = [
  {
    id: "actions",
    header: "Acciones",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "artist.name",
    header: "Artista",
  },
  {
    id: "edit_artist",
    header: "Editar Artista",
  },
  {
    accessorKey: "level",
    header: "Nivel",
  },
  {
    accessorKey: "links",
    header: "Enlaces",
    cell: ({ row }) => {
      const links = row.getValue("links") as any[];

      // Verifica si hay enlaces en la matriz
      if (links && links.length > 0) {
        return (
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-900"
                >
                  {link.url}
                </a>
              </li>
            ))}
          </ul>
        );
      } else {
        return "No hay enlaces disponibles";
      }
    },
  },
];
