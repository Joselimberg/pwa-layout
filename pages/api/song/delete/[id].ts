import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../db/prisma';

type Data = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'DELETE':
            return deleteSong(req, res);

        default:
            res.status(400).json({
                message: 'Bad request'
            });
    }
}

const deleteSong = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {
        const song_id = req.query.id;

        const existingSong = await prisma.song.findUnique({
            where: { id: parseInt(song_id as string) },
        });

        if (existingSong) {
            const existingArtist = await prisma.artist.findUnique({
                where: {
                    id: Number(existingSong.id_artist)
                }
            });

            if (existingArtist) {
                const countArtist = await prisma.song.count({
                    where: {
                        id_artist: Number(existingArtist.id)
                    }
                })

                if (countArtist === 1) {
                    await prisma.artist.delete({
                        where: {
                            id: existingArtist.id
                        }
                    })
                }
            }

            await prisma.song.delete({
                where: { id: parseInt(song_id as string) },
            });



            return res.status(200).json({
                message: 'Pago eliminado correctamente'
            });






        } else {
            return res.status(404).json({
                message: 'Song no encontrada'
            });
        }






    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        });
    }
};
