import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obtener todos los clientes con estatus: true
    const songs = await prisma.song.findMany({});

    return res.status(200).json(songs);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener datos' });
  }
}
