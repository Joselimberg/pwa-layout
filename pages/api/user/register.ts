import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/prisma';
import bcrypt from 'bcryptjs';

type Data = { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {
        name,
        email,
        password
    } = req.body;

    const n_users = await prisma.user.count();

    if (n_users >= 10) {
        return res.status(400).json({
            message: 'Número de usuarios máximo alcanzado'
        });
    }



    const existeUser = await prisma.user.findFirst({
        where: {
            email,
        }
    });

    if (existeUser) {
        return res.status(400).json({
            message: 'Ya existe un usuario con el mismo email'
        });
    } else {
        try {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: bcrypt.hashSync(password),
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Revisar logs del servidor'
            });

        }

        return res.status(200).json({ message: 'Usuario registrado correctamente' });
    }
}
