import { cliente_template } from "../template/cliente.template";

export function enviar_cliente(Fecha: any, Cliente: any, Productos: any[], Total: number) {
    let template_email = cliente_template(Fecha, Cliente, Productos, Total);
    return { template_email };
}