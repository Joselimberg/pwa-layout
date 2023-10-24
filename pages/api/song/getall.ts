import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        pageIndex,
        pageSize,
        name,
        artist,
        level,
    } = req.query;

    try {
        // Construir la consulta con los parámetros de filtro
        const filterOptions: any = {}; // Utilizar 'any' temporalmente, o puedes definir una interfaz para el filtro

        if (name) {
            filterOptions.name = {
                contains: name as string,
            };
        }
        if (artist) {

            filterOptions.artist = {
                name: {
                    contains: artist as string
                }
            };
        }
        if (level) {
            filterOptions.level = {
                contains: level as string,
            };
        }


        const skip = Number(pageIndex) * Number(pageSize);
        const take = Number(pageSize);

        const songs = await prisma.song.findMany({
            where: filterOptions, // Aplicar los filtros aquí
            skip,
            take,
            include: {
                artist: true
            }
        });



        const totalSongs = await prisma.song.count({ where: filterOptions });
        const totalPages = Math.ceil(totalSongs / take);

        return res.status(200).json({ songs, totalPages });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener datos' });
    }
}
