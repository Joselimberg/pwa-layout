import { useEffect, useState } from "react";

import queryString from "query-string";
import Modal from "react-modal";

import {
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ISong } from "../../interfaces/";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";
import SongEditModal from "./SongEditModal";
import SongDetailsModal from "./SongDetailsModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  label?: string;
  id_user: number;
}

export function DataTable<TData, TValue>({
  columns,
  id_user,
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [tableData, setTableData] = useState<ISong[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ISong | null>(null);
  const [filterName, setFilterName] = useState("");
  const [filterArtist, setFilterArtist] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, filterName, filterLevel, filterArtist]);

  const fetchData = async () => {
    try {
      const queryParams = queryString.stringify({
        pageIndex,
        pageSize,
        name: filterName,
        level: filterLevel,
        artist: filterArtist,
        id_user,
      });

      const response = await fetch(`/api/song/getall?${queryParams}`);
      const res = await response.json();
      setTableData(res.songs);
      setPageLimit(res.totalPages);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const table = useReactTable({
    data: tableData as any,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (rowData: ISong) => {
    setSelectedRecord(rowData);
    setShowEditModal(true);
  };

  const handleDetails = (rowData: ISong) => {
    setSelectedRecord(rowData);
    setShowDetailsModal(true);
  };

  // Manjador para cerrar el modal
  const handleCloseModal = () => {
    setSelectedRecord(null);
    setShowEditModal(false);
    setShowDetailsModal(false);
  };

  console.log(table.getCanNextPage());

  return (
    <>
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div className="flex flex-col items-start">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {(header.column.columnDef as any).accessorKey ===
                            "name" && (
                            <input
                              type="text"
                              value={filterName}
                              onChange={(e) => setFilterName(e.target.value)}
                              placeholder="Filtrar por Nombre"
                            />
                          )}
                          {(header.column.columnDef as any).accessorKey ===
                            "artist.name" && (
                            <input
                              type="text"
                              value={filterArtist}
                              onChange={(e) => setFilterArtist(e.target.value)}
                              placeholder="Filtrar por Artista"
                            />
                          )}
                          {(header.column.columnDef as any).accessorKey ===
                            "level" && (
                            <input
                              type="text"
                              value={filterLevel}
                              onChange={(e) => setFilterLevel(e.target.value)}
                              placeholder="Filtrar por Nivel"
                            />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "actions") {
                        return (
                          <TableCell key={cell.id}>
                            <div className="flex flex-row">
                              <Button
                                className="btn-primary px-5 text-base bg-blue-500 text-white hover:bg-green-500 mx-1"
                                onClick={() => handleEdit(row.original as any)}
                              >
                                Editar
                              </Button>
                              <Button
                                className="btn-primary px-4 text-base bg-blue-500 text-white hover:bg-green-500"
                                onClick={() =>
                                  handleDetails(row.original as any)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-start space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (pageIndex > 0) {
                setPageIndex(pageIndex - 1);
              }
            }}
            disabled={pageIndex === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex >= pageLimit - 1}
          >
            Siguiente
          </Button>
        </div>
      </div>
      {selectedRecord && (
        <SongDetailsModal
          showModal={showDetailsModal}
          onCloseModal={handleCloseModal}
          selectedRecord={selectedRecord}
        />
      )}
      {selectedRecord && (
        <SongEditModal
          showModal={showEditModal}
          onCloseModal={handleCloseModal}
          selectedRecord={selectedRecord}
        />
      )}
    </>
  );
}
