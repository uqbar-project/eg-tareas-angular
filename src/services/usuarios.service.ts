import { Usuario } from "src/domain/usuario";

export abstract class UsuariosService {
    abstract usuariosPosibles(): Promise<Usuario[]>
}