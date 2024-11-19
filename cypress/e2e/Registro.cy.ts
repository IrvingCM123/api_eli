import { getApiURL } from "./const";

describe('Registro', () => {

	const baseUrl = getApiURL() + 'auth';

	it('Registra un usuario, con un rol inválido', () => {
		const userData = {
			Nombre: 'Irving',
			Apellidos: 'Conde',
			Correo_electronico: 'irvingconde@gmail.com',
			Contraseña: 'securepassword',
			cuenta_rol: 'USER'
		};

		cy.request('POST', `${baseUrl}/register`, userData)
			.then((response) => {
				expect(response.body.status).to.eq(500);
				expect(response.body.mensaje).to.eq('Error inesperado');
			});
	});


	it('La API recibirá solamente el parametro de Nombre Usuario en la petición', () => {
		const userData = {
			Nombre: 'Eli',
			Apellidos: '',
			Correo_electronico: '',
			Contraseña: '',
			cuenta_rol: ''
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.include('El identificador debe ser un correo electrónico válido');
			expect(response.body.message).to.include('Correo_electronico should not be empty');
			expect(response.body.message).to.include('Contraseña must be longer than or equal to 8 characters');
		});
	});

	it('La API recibirá solamente el parametro de Apellido Usuario en la petición', () => {
		const userData = {
			Nombre: '',
			Apellidos: 'Galindo',
			Correo_electronico: '',
			Contraseña: '',
			cuenta_rol: ''
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.include('El identificador debe ser un correo electrónico válido');
			expect(response.body.message).to.include('Correo_electronico should not be empty');
			expect(response.body.message).to.include('Contraseña must be longer than or equal to 8 characters');
		});
	});

	it('La API recibirá solamente el parametro de Correo Usuario en la petición', () => {
		const userData = {
			Nombre: '',
			Apellidos: '',
			Correo_electronico: 'EliGalindo@Gmail.com',
			Contraseña: '',
			cuenta_rol: ''
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.include('Contraseña must be longer than or equal to 8 characters');
		});
	});

	it('La API recibirá solamente el parametro de Contraseña Usuario en la petición', () => {
		const userData = {
			Nombre: '',
			Apellidos: '',
			Correo_electronico: '',
			Contraseña: 'EliGalindo123',
			cuenta_rol: ''
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.include('El identificador debe ser un correo electrónico válido');
			expect(response.body.message).to.include('Correo_electronico should not be empty');
		});
	});

	it('La API recibirá solamente el parametro de Rol Usuario en la petición', () => {
		const userData = {
			Nombre: '',
			Apellidos: '',
			Correo_electronico: '',
			Contraseña: '',
			cuenta_rol: 'ADMIN'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.include('El identificador debe ser un correo electrónico válido');
			expect(response.body.message).to.include('Correo_electronico should not be empty');
			expect(response.body.message).to.include('Contraseña must be longer than or equal to 8 characters');
		});
	});

	it('La API recibirá los datos del usuario, conteniendo en ellos una cuenta existente en la base de datos', () => {
		const userData = {
			Nombre: 'Eli',
			Apellidos: 'Galindo',
			Correo_electronico: 'EliGalindo@Gmail.com',
			Contraseña: 'EliGalindo123',
			cuenta_rol: 'ADMIN'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.status).to.eq(500);
			expect(response.body.mensaje).to.include('La cuenta ya existe');
		});
	});

	//it('La API recibirá las credenciales correctas del usuario para crear una nueva cuenta', () => {
	//	const userData = {
	//		Nombre: 'Eli',
	//		Apellidos: 'Galindo',
	//		Correo_electronico: 'EliGalindo9@Gmail.com',
	//		Contraseña: 'EliGalindo123',
	//		cuenta_rol: 'ADMIN'
	//	};
//
	//	cy.request('POST', `${baseUrl}/register`, userData)
	//	.then((response) => {
	//		expect(response.status).to.eq(201);
	//		expect(response.body.mensaje).to.include('Registro exitoso');
	//	});
	//});

	it('La API recibirá parámetros con nombres incorrectos', () => {
		const userData = {
			NombreUsuario: 'Eli',
			ApellidosUsuario: 'Galindo',
			Correo_electronico: 'EliGalindo@Gmail.com',
			Contraseña: 'EliGalindo123',
			cuenta_rol: 'ADMIN'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.statusCode).to.eq(400);
			expect(response.body.message).to.include('property NombreUsuario should not exist');
			expect(response.body.message).to.include('property ApellidosUsuario should not exist');
			expect(response.body.message).to.include('Nombre must be shorter than or equal to 50 characters');
			expect(response.body.message).to.include('Nombre must be a string');
			expect(response.body.message).to.include('Apellidos must be shorter than or equal to 50 characters');
			expect(response.body.message).to.include('Apellidos must be a string');
		});
	});

	it('La API recibirá parámetros con tipos incorrectos', () => {
		const userData = {
			NombreUsuario: 123,
			ApellidosUsuario: 'Galindo',
			Correo_electronico: 'EliGalindo@Gmail.com',
			Contraseña: 'EliGalindo123',
			cuenta_rol: 'ADMIN'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/register`,
			body: userData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.statusCode).to.eq(400);
			expect(response.body.message).to.include('Nombre must be shorter than or equal to 50 characters');
			expect(response.body.message).to.include('Nombre must be a string');
		});
	});
});
