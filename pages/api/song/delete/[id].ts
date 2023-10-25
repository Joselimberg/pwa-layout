import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../db/prisma';
import fs from 'fs';
import path from 'path';

type Data = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'DELETE':
            return deletePago(req, res);

        default:
            res.status(400).json({
                message: 'Bad request'
            });
    }
}

const deletePago = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {
        const pagoId = req.query.id;

        // Verificar si el pago existe antes de intentar eliminarlo
        const existingPago = await prisma.pago.findUnique({
            where: { id: parseInt(pagoId as string) },
        });

        if (!existingPago) {
            return res.status(404).json({
                message: 'Pago no encontrado'
            });
        }

        // Elimina el fichero de la poliza si existe
        if (existingPago.poliza) {

            const existingDocumento = await prisma.clientesArchivos.findFirst({
                where: { id_pago: existingPago.id },
            });

            if (!existingDocumento) {
                return res.status(404).json({
                    message: 'Documento no encontrado'
                });
            }

            console.log(existingDocumento);

            const deleteDirectory = path.join(process.cwd(), existingDocumento.ruta!);

            fs.unlinkSync(deleteDirectory);
        }


        // Eliminar el pago utilizando Prisma
        await prisma.pago.delete({
            where: { id: parseInt(pagoId as string) },
        });





        return res.status(200).json({
            message: 'Pago eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        });
    }
};
