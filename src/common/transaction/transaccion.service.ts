import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { Errores_Operaciones } from '../helpers/operaciones.helpers';
@Injectable()
export class TransaccionService {
  constructor(private connection: Connection) {}

  //Vamos a utilizar una libreria llamada QueryRunner, esta libreria lo que permite es realizar modificaciones en una base de datos
  // cuando veas un ? en los parametros de una funcion, significa que ese parametro es opcional
  async transaction(
    tipo: Tipo_Transaccion,
    entidad: any,
    datos_guardar: any,
    columna_entidad?: string,
    columna_identificador?: string | number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    switch (tipo) {
      case Tipo_Transaccion.Guardar:
        try {
          const resultado = await queryRunner.manager.save(
            entidad,
            datos_guardar,
          );
          await queryRunner.commitTransaction();
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          };
        } finally {
          await queryRunner.release();
        }
      case Tipo_Transaccion.Guardar_Con_Parametros:
        try {
          const resultado = await queryRunner.manager.save(entidad, {
            [columna_entidad]: datos_guardar,
          });
          await queryRunner.commitTransaction();
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          }
        } finally {
          await queryRunner.release();
        }
      case Tipo_Transaccion.Actualizar:
        try {
          const resultado = await queryRunner.manager.update(entidad, columna_identificador, datos_guardar);
          await queryRunner.commitTransaction();
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          }
        } finally {
          await queryRunner.release();
        }
      case Tipo_Transaccion.Actualizar_Con_Parametros:
        try {
          const resultado = await queryRunner.manager.update(entidad, columna_identificador, {
            [columna_entidad]: datos_guardar,
          });
          await queryRunner.commitTransaction();
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          }
        } finally {
          await queryRunner.release();
        }
      case Tipo_Transaccion.Eliminar:
        try {
          const resultado = await queryRunner.manager.delete(entidad, datos_guardar);
          await queryRunner.commitTransaction();
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          }
        } finally {
          await queryRunner.release();
        }
      case Tipo_Transaccion.Eliminar_Con_Parametros:
        try {
          const resultado = await queryRunner.manager.delete(entidad, {
            [columna_entidad]: columna_identificador,
          });
          await queryRunner.commitTransaction();
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          }
        } finally {
          await queryRunner.release();
        }
      case Tipo_Transaccion.Consultar:
        try {
          const resultado = await queryRunner.manager.find(entidad);
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          }
        } finally {
          await queryRunner.release();
        }
      case Tipo_Transaccion.Consultar_Con_Parametros:
        try {
          const resultado = await queryRunner.manager.find(entidad, {
            where: {[columna_entidad]: columna_identificador},  
          },
          );
          return {
            status: 201,
            resultado: resultado,
          };
        } catch (error) {
          return {
            status: 500,
            resultado: Errores_Operaciones.ERROR_INESPERADO,
          }
        } finally {
          await queryRunner.release();
        }
      default:
        break;
    }
  }
}
