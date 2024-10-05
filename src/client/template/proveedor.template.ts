export function proveedor_template(
    Fecha: string,
    Proveedor: any,
    Productos: any[],
) {
    const productosHtml = Productos.map(
        (producto) => `
      <p class="iterar">
          <span>Producto: ${producto.Nombre}</span>
          <span>Cantidad: ${producto.Cantidad}</span>
      </p>
  `,
    ).join('');

    const html_boletos = `
     <!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
        }

        .container {
            max-width: 80%;
            margin: 5% auto;
            padding: 2%;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            color: #333;
            font-size: 150%;
            margin-bottom: 20px;
        }

        .info {
            margin-bottom: 20px;
            color: #666;
            font-size: 100%;
        }

        .info p {
            margin: 2.5% 0;
        }

        .info p span {
            margin: 1.5%;
            font-weight: bold;
        }

        .iterar {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }

        .download-link {
            text-align: center;
        }

        .image-container {
            text-align: center;
            margin-top: 20px;
        }

        .apple img {
            max-height: 45px;
        }

        img {
            height: auto;
            max-height: 50%;
            width: 80%;
            border-radius: 10px;
            margin: 0 auto;
        }
    </style>
</head>

<body>
    <div class="container">

        <div class="image-container">
            <img src="https://firebasestorage.googleapis.com/v0/b/novedades-68953.appspot.com/o/klipartz.com.png?alt=media&token=09a6747a-e545-4222-840b-8879c97b65b2"
                alt="Imagen 1">
        </div>

        <div class="header">
            <h2>Solicitud de pedidos</h2>
        </div>

        <div class="info">

            <p>Fecha de solicitud: ${Fecha}</p>

            <p>Estimado Proveedor: ${Proveedor}, por medio de este correo electrónico se le proporciona la información relacionada con la orden de compra solicitada.</p>

            ${productosHtml}

        </div>

        <div class="info">
            <p>Solicitamos su pronta respuesta acerca de la fecha de entrega programada.</p>

            <p>Atentamente,</p>
            <p>Novedades y Hogar, Huatusco. Ver.</p>
        </div>
    </div>
</body>

</html>
  `;
    return html_boletos;
}
