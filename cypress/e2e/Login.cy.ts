import { getApiURL } from "./const";

describe('Registro', () => {
	
	const baseUrl = getApiURL() + 'auth';

	it('La API recibirá solamente el parametro de correo electronico en la petición	', () => {
		const loginData = {
			Correo_electronico: 'EliGalindo@gmail.com',
			Contraseña: ''
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/login`,
			body: loginData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.statusCode).to.eq(400);
			expect(response.body.message).to.include('Contraseña must be longer than or equal to 8 characters');
			expect(response.body.message).to.include('Contraseña should not be empty');
		});
	});

	it('La API recibirá solamente el parametro de contraseña en la petición	', () => {
		const loginData = {
			Correo_electronico: '',
			Contraseña: 'EliGalindo123'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/login`,
			body: loginData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.statusCode).to.eq(400);
			expect(response.body.message).to.include('Debe ser un correo electrónico válido');
			expect(response.body.message).to.include('Correo_electronico should not be empty');
		});
	});

	it('La API recibirá las credenciales correctas del usuario para iniciar sesión', () => {
		const loginData = {
			Correo_electronico: 'EliGalindo@gmail.com',
			Contraseña: 'EliGalindo123'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/login`,
			body: loginData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.status).to.eq(201);
			expect(response.body.mensaje).to.eq('Sesión activa');
		});
	});

	it('La API recibirá las credenciales incorrectas del usuario para iniciar sesión', () => {
		const loginData = {
			Correo_electronico: 'EliGalindo@gmail.com',
			Contraseña: 'EliGalindo'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/login`,
			body: loginData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.status).to.eq(500);
			expect(response.body.mensaje).to.eq('La contraseña no es valida');
		});
	});

	it('La API recibirá parámetros con nombres incorrectos', () => {
		const loginData = {
			Correo_electronicoUsuario: '',
			Contraseña: 'EliGalindo123'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/login`,
			body: loginData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.statusCode).to.eq(400);
			expect(response.body.message).to.include('property Correo_electronicoUsuario should not exist');
			expect(response.body.message).to.include('Debe ser un correo electrónico válido');
			expect(response.body.message).to.include('Correo_electronico should not be empty');
		});
	});

	it('La API recibirá parámetros con tipos incorrectos', () => {
		const loginData = {
			Correo_electronico: 123,
			Contraseña: 'EliGalindo123'
		};

		cy.request({
			method: 'POST',
			url: `${baseUrl}/login`,
			body: loginData,
			failOnStatusCode: false
		}).then((response) => {
			expect(response.body.statusCode).to.eq(400);
			expect(response.body.message).to.include('Debe ser un correo electrónico válido');
		});
	});

});
