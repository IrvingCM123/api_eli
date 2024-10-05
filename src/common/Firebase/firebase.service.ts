import { Injectable } from '@nestjs/common';
import { firebaseAdmin } from 'src/common/Firebase/firebase.config'; // Asegúrate de que el path sea correcto
import { v4 as uuidv4 } from 'uuid'; // Para generar un token único
import * as mime from 'mime-types'; // Para identificar el tipo MIME de la imagen

@Injectable()
export class FirebaseService {
  private bucket = firebaseAdmin.storage().bucket();

  async AlmacenarImagen(ImagenBase64: string, NombreImagen: string): Promise<string> {
    try {
      // Convertir la imagen Base64 en un Buffer
      const base64Data = ImagenBase64.replace(/^data:image\/\w+;base64,/, '');

    // Convertir la imagen base64 en un Buffer
    const buffer = Buffer.from(base64Data, 'base64');

      // Obtener la extensión del archivo basado en el tipo MIME
      const extensionImagen = mime.extension(mime.lookup(NombreImagen) || 'image/jpeg');
      // Crear un nombre de archivo único para la imagen
      const nombreImagen = `${NombreImagen}.${extensionImagen}`;

      // Definir el destino en Firebase Storage
      const destinoImagen = `images/${nombreImagen}`;

      // Crear un token único para la imagen 
      const token = uuidv4();

      // Subir el archivo a Firebase Storage
      const file = this.bucket.file(destinoImagen);
      // Guardar la imagen en Firebase Storage con los metadatos necesarios
      await file.save(buffer, {
        metadata: {
          contentType: mime.lookup(extensionImagen) || 'image/jpeg',
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
        public: false, // Cambiar a true si quieres que la imagen sea pública
      });

      // Construir la URL de descarga de la imagen
      const urlImagenFirebase = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`;
      return urlImagenFirebase;
    } catch (error) {
      return "Error al almacenar la imagen";
    }
  }
}
