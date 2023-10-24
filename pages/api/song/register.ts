import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/prisma';

type Data = { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return registerSong(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const registerSong = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    console.log("Entrando al controller");
    const {
        name,
        artist,
        level,
        id_user,
        linklist,
    } = req.body;



    const existeSong = await prisma.song.findFirst({
        where: {
            name,
            artist: {
                name: artist
            }
        }
    });

    if (existeSong) {
        return res.status(400).json({
            message: 'Ya existe una song con ese nombre y artista'
        });
    }

    const existeArtist = await prisma.artist.findFirst({
        where: {
            name: artist
        }
    });

    if (existeArtist) {

        try {
            await prisma.song.create({
                data: {
                    name,
                    artist: {
                        connect: { id: existeArtist.id }
                    },
                    level,
                    user: {
                        connect: { id: id_user }
                    }
                    ,
                    links: linklist,
                },
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Revisar logs del servidor'
            });
        }

        return res.status(200).json({ message: 'Song registrada correctamente' });

    } else {

        try {

            const new_artist = await prisma.artist.create({
                data: {
                    name: artist
                }
            })

            await prisma.song.create({
                data: {
                    name,
                    artist: {
                        connect: { id: new_artist.id }
                    },
                    level,
                    user: {
                        connect: { id: id_user }
                    }
                    ,
                    links: linklist,
                },
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Revisar logs del servidor'
            });
        }

        return res.status(200).json({ message: 'Song registrada correctamente' });

    }


}
