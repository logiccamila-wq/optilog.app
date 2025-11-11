import { checkUserPermissions, validateCredentials, hasModuleAccess, getUserRole, UserRole } from './permissions';

describe('permissions utils', () => {
  it('deve retornar permissões corretas para usuário autorizado', () => {
    const user = checkUserPermissions('logiccamila@gmail.com');
    expect(user).not.toBeNull();
    expect(user?.role).toBe(UserRole.ADMINISTRADOR);
    expect(user?.active).toBe(true);
  });

  it('deve retornar null para usuário não autorizado', () => {
    expect(checkUserPermissions('naoexiste@teste.com')).toBeNull();
  });

  it('deve validar credenciais corretas', () => {
    expect(validateCredentials('logiccamila@gmail.com', 'Multi12345678')).toBe(true);
  });

  it('deve recusar senha errada', () => {
    expect(validateCredentials('logiccamila@gmail.com', 'errada')).toBe(false);
  });

  it('deve verificar acesso a módulo', () => {
    expect(hasModuleAccess('logiccamila@gmail.com', 'dashboard')).toBe(true);
    expect(hasModuleAccess('teste@teste.com', 'dashboard')).toBe(true);
    expect(hasModuleAccess('teste@teste.com', 'financeiro')).toBe(false);
  });

  it('deve retornar role correta', () => {
    expect(getUserRole('logiccamila@gmail.com')).toBe(UserRole.ADMINISTRADOR);
    expect(getUserRole('teste@teste.com')).toBe(UserRole.VISUALIZADOR);
    expect(getUserRole('naoexiste@teste.com')).toBeNull();
  });
});
