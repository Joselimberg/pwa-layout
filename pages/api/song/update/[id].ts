import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../db/prisma';

type Data = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'PUT':
            return updateSong(req, res);

        default:
            res.status(400).json({
                message: 'Bad request'
            });
    }
}

const updateSong = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {
        name,
        artist,
        level,
        linklist,
        id_user,
    } = req.body;


    const song_id = req.query.id;
    const existingSong = await prisma.song.findUnique({
        where: {
            id: parseInt(song_id as string),
        },
    });

    if (!existingSong) {
        return res.status(404).json({
            message: 'Song no encontrada'
        });
    }

    const existingSongtWithSameName = await prisma.song.findFirst({
        where: {
            name,
            artist: {
                name: artist
            },
            id_user: parseInt(id_user as string),
            NOT: {
                id: parseInt(song_id as string),
            },
        },
    });

    if (existingSongtWithSameName) {
        return res.status(400).json({
            message: 'La canción que trata de ingresar ya esta registrada',
        });
    }

    const existeArtist = await prisma.artist.findFirst({
        where: {
            name: artist,
            id_user
        }
    });

    if (existeArtist) {
        try {
            await prisma.song.update({
                where: {
                    id: parseInt(song_id as string),
                },
                data: {
                    name,
                    artist: {
                        connect: { id: existeArtist.id }
                    },
                    level,
                    links: linklist,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Revisar logs del servidor'
            });
        }
        return res.status(200).json({ message: 'Song actualizada correctamente' });

    } else {
        try {
            const new_artist = await prisma.artist.create({
                data: {
                    name: artist,
                    id_user
                }
            });
            await prisma.song.update({
                where: {
                    id: parseInt(song_id as string),
                },
                data: {
                    name,
                    artist: {
                        connect: { id: new_artist.id }
                    },
                    level,
                    links: linklist,
                },
            });


        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Revisar logs del servidor'
            });
        }

        return res.status(200).json({ message: 'Song actualizada correctamente' });
    }
};