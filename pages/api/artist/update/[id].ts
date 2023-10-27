import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../db/prisma';

type Data = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'PUT':
            return updateArtist(req, res);

        default:
            res.status(400).json({
                message: 'Bad request'
            });
    }
}

const updateArtist = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {
        name,
        id_user,
    } = req.body;


    const artist_id = req.query.id;
    const existingArtist = await prisma.artist.findUnique({
        where: {
            id: parseInt(artist_id as string),
        },
    });

    if (!existingArtist) {
        return res.status(404).json({
            message: 'artista no encontrado'
        });
    }

    const existingArtistWithSameName = await prisma.artist.findFirst({
        where: {
            name,
            id_user: parseInt(id_user as string),
            NOT: {
                id: parseInt(artist_id as string),
            },
        },
    });

    if (existingArtistWithSameName) {
        return res.status(400).json({
            message: 'El artista que trata de ingresar ya esta registrado',
        });
    }

    try {
        await prisma.artist.update({
            where: {
                id: parseInt(artist_id as string),
            },
            data: {
                name,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        });
    }
    return res.status(200).json({ message: 'Artista actualizado correctamente' });

};