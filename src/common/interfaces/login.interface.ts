export interface Login {
    correo: string;
    contrasena: string;
}

export interface interfaz_Registro_Cuenta {
    cuenta_Nombre: string;
    cuenta_Apellido: string;
    cuenta_Correo: string;
    cuenta_Contrasena: string;
    cuenta_Rol: string;
    cuenta_Fecha_Registro: Date;
    cuenta_Estado_Cuenta: string;
}
