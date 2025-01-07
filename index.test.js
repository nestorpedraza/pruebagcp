jest.mock('@google-cloud/functions-framework');
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('API HTTP Pruebas', () => {
  let req, res;
  
  beforeEach(() => {
    process.env.ACCESS_TOKEN = 'token-valido-prueba';
    req = {
      method: 'POST',
      is: jest.fn(),
      headers: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      set: jest.fn()
    };
  });

  // Test método HTTP incorrecto
  test('debería rechazar métodos que no sean POST', () => {
    req.method = 'GET';
    require('./index');
    const apiHttp = require('@google-cloud/functions-framework').http.mock.calls[0][1];
    apiHttp(req, res);
    
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ 
      data: 'Método No Permitido', 
      status: 405 
    });
  });

  // Test Content-Type incorrecto
  test('debería rechazar Content-Type diferente a application/json', () => {
    req.is = jest.fn().mockReturnValue(false);
    require('./index');
    const apiHttp = require('@google-cloud/functions-framework').http.mock.calls[0][1];
    apiHttp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      data: 'Content-Type debe ser application/json', 
      status: 400 
    });
  });

  // Test token inválido
  test('debería rechazar token inválido', () => {
    req.is = jest.fn().mockReturnValue(true);
    req.headers['auth-token'] = 'token-invalido';
    require('./index');
    const apiHttp = require('@google-cloud/functions-framework').http.mock.calls[0][1];
    apiHttp(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ 
      data: 'Acceso Denegado', 
      status: 403 
    });
  });

  // Test datos faltantes
  test('debería rechazar datos faltantes', () => {
    req.is = jest.fn().mockReturnValue(true);
    req.headers['auth-token'] = 'token-valido-prueba';
    require('./index');
    const apiHttp = require('@google-cloud/functions-framework').http.mock.calls[0][1];
    apiHttp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      data: 'Datos obligatorios faltantes', 
      status: 400 
    });
  });

  // Test tipos inválidos
  test('debería rechazar tipos de datos inválidos', () => {
    req.is = jest.fn().mockReturnValue(true);
    req.headers['auth-token'] = 'token-valido-prueba';
    req.body = { id_evento: '1', orden_compra: '2' };
    require('./index');
    const apiHttp = require('@google-cloud/functions-framework').http.mock.calls[0][1];
    apiHttp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      data: 'Datos inválidos', 
      status: 400 
    });
  });

  // Test caso exitoso
  test('debería procesar solicitud válida correctamente', () => {
    req.is = jest.fn().mockReturnValue(true);
    req.headers['auth-token'] = 'token-valido-prueba';
    req.body = { id_evento: 1, orden_compra: 2 };
    require('./index');
    const apiHttp = require('@google-cloud/functions-framework').http.mock.calls[0][1];
    apiHttp(req, res);

    expect(res.set).toHaveBeenCalledTimes(4);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
      data: 'Su evento es 1 y su orden es 2!', 
      status: 200 
    });
  });
});
