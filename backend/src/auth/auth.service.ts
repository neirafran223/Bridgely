import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { RegistroInput, LoginInput } from './schemas';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function registrarUsuario(datos: RegistroInput) {
    const email = datos.email.toLowerCase().trim();

    const existente = await prisma.usuario.findUnique({
        where: { email },
    });

    if (existente) {
        throw new Error('Ya existe un usuario con este email');
    }

    const passwordHash = await bcrypt.hash(datos.password, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nombre: datos.nombre,
            email,
            passwordHash,
            telefono: datos.telefono,
            rol: datos.rol,
        },
    });

    if (datos.rol === 'cliente') {
        await prisma.perfilCliente.create({
            data: { usuarioId: usuario.id, empresa: datos.empresa },
        });
    } else {
        await prisma.perfilDeveloper.create({
            data: {
                usuarioId: usuario.id,
                tituloProfesional: datos.tituloProfesional,
                bio: datos.bio,
            },
        });
    }

    const token = generarToken(usuario.id, usuario.rol);

    return { token, usuario }
}

export async function loginUsuario(datos: LoginInput) {
    const email = datos.email.toLowerCase().trim();

    const usuario = await prisma.usuario.findUnique({
        where: { email },
    });

    if (!usuario) {
        throw new Error('Credenciales invalidas');
    }

    const passwordValida = await bcrypt.compare(datos.password, usuario.passwordHash);

    if (!passwordValida){
        throw new Error( 'Credenciales invalidas' );
    }

    if (usuario.suspendido) {
        throw new Error('Tu cuenta ha sido suspendida');
    }

    const token = generarToken(usuario.id, usuario.rol);

    return { usuario, token };
}

function generarToken(usuarioId: string, rol: string) {
    return jwt.sign({ usuarioId, rol }, JWT_SECRET, { expiresIn: '7d' });
}