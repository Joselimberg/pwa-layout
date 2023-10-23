import bcrypt from "bcryptjs";
import { prisma } from "./prisma";


export const checkUserEmailPassword = async (email: string, password: string) => {

    const user = await prisma.user.findFirst({
        where: {
            email,
            status: true
        }
    })

    if (!user) {
        // console.log("Usuario inactivo");
        return null
        // return res.status(400).json({ message: 'Correo o contraseña no válidos' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
        // console.log("Usuario contra incorrecta");
        return null
        // return res.status(400).json({ message: 'Correo o contraseña no válidos' })
    }

    const id = user.id;
    const name = user.name;
    const role = user.role;

    return {
        id,
        name,
        email,
        role,
    }

}