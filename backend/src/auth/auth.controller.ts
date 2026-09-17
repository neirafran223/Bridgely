import { Request, Response } from 'express';
import { registroSchema, loginSchema } from './schemas';
import { registrarUsuario, loginUsuario } from './auth.service';

export async function registro (req: Request, res: Response) {
    const resultado = registroSchema.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({ error: resultado.error.issues[0].message });
    }

    try {
        const { usuario, token } = await registrarUsuario(resultado.data);
        res.status(201).json({
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, telefono: usuario.telefono, rol: usuario.rol },  
        });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al registrar usuario';
        res.status(400).json({ error: mensaje });
    }
}

export async function login(req: Request, res: Response) {
    const resultado = loginSchema.safeParse(req.body);
    
    if (!resultado.success) {
        return res.status(400).json({ error: resultado.error.issues[0].message });
    }

    try {
        const { usuario, token } = await loginUsuario(resultado.data);
        res.json({
            token, 
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, telefono: usuario.telefono, rol: usuario.rol },
        });
    } catch (error) {
        const mensaje = error instanceof Error ?  error.message : 'Error al iniciar sesion';
        res.status(401).json({ error: mensaje });
    }
}