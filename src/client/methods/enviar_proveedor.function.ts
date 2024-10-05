import { proveedor_template } from "../template/proveedor.template";

export function enviar_proveedor(Fecha: string, Proveedor: any, Productos: any[]) {
    let template_email = proveedor_template(Fecha, Proveedor, Productos);
    return { template_email };
}