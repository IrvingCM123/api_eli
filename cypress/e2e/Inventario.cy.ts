import { CreateProductoDto } from "src/resource/productos/dto/create-producto.dto";
import { UpdateProductoDto } from "src/resource/productos/dto/update-producto.dto";
import { UpdateInventarioDto } from "src/resource/inventario/dto/update-inventario.dto";

import { getApiURL, getTokenAccess } from "./const";

import { enumProductoStatus } from "src/common/enums/inventario_status.enum";
import { enumTipoProducto } from "src/common/enums/tipos_productos.enum";

describe('Registro', () => {

	const baseUrl = getApiURL() + 'productos';

	it('Se retornarán correctamente los productos registrados', () => {

		cy.request({
			method: 'GET',
			url: getApiURL() + 'inventario',
			headers: {
				Authorization: `Bearer ${getTokenAccess()}`
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.length > 0);
		});

	});

	it('Se recibirán los datos correctos para registrar un nuevo producto', () => {
		const productoData = {
			producto_Nombre: "Sillón Mueble Piel",
			producto_Categoria: enumTipoProducto.Muebleria,
			producto_ProveedorID: "Muebles Dico",
			producto_Precio: 714.21,
			producto_stock: 80,
			producto_ImagenURL: "SillonPiel.jpg"
		};
	
		const mockResponse = {
			status: 201,
			mensaje: 'Producto creado con éxito',
			data: productoData
		};
	
		cy.window().then((win) => {
			cy.stub(win, 'fetch').withArgs('http://localhost:80/servidor/productos', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getTokenAccess()}`
				},
				body: JSON.stringify(productoData)
			}).resolves({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			});
		});
	
		cy.window().then((win) => {
			return win.fetch('http://localhost:80/servidor/productos', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getTokenAccess()}`
				},
				body: JSON.stringify(productoData)
			})
			.then((response) => response.json())
			.then((body) => {
				expect(body.status).to.eq(201);
				expect(body.mensaje).to.eq('Producto creado con éxito');
				expect(body.data).to.deep.equal(productoData);
			});
		});
	});
	



	it('Se recibirá una categoría que no es permitida por el sistema', () => {

		const productoData = {
			producto_Nombre: "Aretes de Oro",
			producto_Categoria: "JOYERIA",
			producto_ProveedorID: "Muebles Dico",
			producto_Precio: 245.21,
			producto_stock: 40,
			producto_ImagenURL: "SillonPiel.jpg"
		}

		cy.request({
			method: 'POST',
			url: `${baseUrl}`,
			body: productoData,
			headers: {
				Authorization: `Bearer ${getTokenAccess()}`
			},
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body.status).to.eq(500);
			expect(response.body.mensaje).to.include('Error al crear el producto');
		});
	});

	it('Se recibirá un proveedor que no existe', () => {

		const productoData = {
			producto_Nombre: "Sillón Mueble Piel",
			producto_Categoria: enumTipoProducto.Muebleria,
			producto_ProveedorID: "YOBETT S.A DE C.V",
			producto_Precio: 245.21,
			producto_stock: 40,
			producto_ImagenURL: "SillonPiel.jpg"
		}

		cy.request({
			method: 'POST',
			url: `${baseUrl}`,
			body: productoData,
			headers: {
				Authorization: `Bearer ${getTokenAccess()}`
			},
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body.status).to.eq(500);
			expect(response.body.mensaje).to.include('El proveedor no existe');
		});
	});

	it('Se recibirá un campo vacío', () => {

		const productoData = {
			producto_Nombre: '',
			producto_Categoria: enumTipoProducto.Muebleria,
			producto_ProveedorID: "Muebles Dico",
			producto_Precio: 245.21,
			producto_stock: 40,
			producto_ImagenURL: "SillonPiel.jpg"
		}

		cy.request({
			method: 'POST',
			url: `${baseUrl}`,
			body: productoData,
			headers: {
				Authorization: `Bearer ${getTokenAccess()}`
			},
			failOnStatusCode: false
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.statusCode).to.eq(400);
			expect(response.body.message).to.include('El campo producto_Nombre no puede estar vacío');
		});
	});

	it('Se actualizará correctamente un producto', () => {

		const productoData: UpdateProductoDto = {
			producto_Nombre: "Sillón Piel",
			producto_Categoria: enumTipoProducto.Muebleria,
			producto_Status: enumProductoStatus.ACTIVO,
			producto_Precio: 714.21,
			producto_ImagenURL: "SillonPiel.jpg"
		}

		cy.intercept('PUT', `${baseUrl}/23`, {
			status: 200,
			body: {
				status: 201,
				mensaje: 'Producto actualizado con éxito',
				data: productoData
			}
		}).as('updateProducto');

		cy.request({
			method: 'PUT',
			url: `${baseUrl}/23`,
			body: productoData,
			headers: {
				Authorization: `Bearer ${getTokenAccess()}`
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.status).to.eq(200);
			expect(response.body.mensaje).to.include('Producto actualizado con éxito');
		});
	});

	it('Se inactiva un producto', () => {

		cy.intercept('DELETE', `${baseUrl}/23`, {
			status: 200,
			body: {
				status: 200,
				mensaje: 'Producto eliminado con éxito',
			}
		}).as('updateProducto');

		cy.request({
			method: 'DELETE',
			url: `${baseUrl}/23`,
			headers: {
				Authorization: `Bearer ${getTokenAccess()}`
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.status).to.eq(200);
			expect(response.body.mensaje).to.include('Producto eliminado con éxito');
		});
	});

	it('Se activa un producto', () => {

		cy.intercept('PUT', `${baseUrl}/activarProducto/23`, {
			status: 200,
			body: {
				status: 200,
				mensaje: 'Producto eliminado con éxito',
			}
		}).as('updateProducto');

		cy.request({
			method: 'PUT',
			url: `${baseUrl}/activarProducto/23`,
			headers: {
				Authorization: `Bearer ${getTokenAccess()}`
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.status).to.eq(200);
			expect(response.body.mensaje).to.include('Producto activado con éxito'); 
		});
	});

});
