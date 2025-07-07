import { Role } from '../types/models';

type ProtectedRoutes = {
  [key: string]: Role[];
};

// Définition des routes protégées et des rôles autorisés
export const PROTECTED_ROUTES: ProtectedRoutes = {
  // Routes accessibles à tous les rôles
  //,

  // Routes administratives (Admin only)
  '/dashboard/users': [Role.ADMIN],
  '/dashboard/departments': [Role.ADMIN],

  // Routes des chefs de département
  '/dashboard/staff/list': [Role.DEPARTMENT_HEAD],
  '/dashboard/staff/categories': [Role.DEPARTMENT_HEAD],
  '/dashboard/validation': [Role.DEPARTMENT_HEAD],
  '/dashboard/reports': [Role.DEPARTMENT_HEAD],
  '/dashboard/collection': [Role.DEPARTMENT_HEAD],

  // Routes du personnel
  '/dashboard/needs/submit': [ Role.STAFF],
  '/dashboard/needs/list': [Role.DEPARTMENT_HEAD, Role.STAFF],
  '/dashboard/history': [Role.STAFF],

  // Routes futures (commentées dans la navigation)
  /*
  '/dashboard/validation/pending': [Role.ADMIN, Role.DEPARTMENT_HEAD],
  '/dashboard/validation/revision': [Role.ADMIN, Role.DEPARTMENT_HEAD],
  '/dashboard/validation/history': [Role.ADMIN, Role.DEPARTMENT_HEAD],
  '/dashboard/reports/summary': [Role.ADMIN, Role.DEPARTMENT_HEAD],
  '/dashboard/reports/export': [Role.ADMIN, Role.DEPARTMENT_HEAD],
  '/dashboard/needs/revision': [Role.ADMIN, Role.DEPARTMENT_HEAD, Role.STAFF]
  */
} as const;

// Fonction utilitaire pour vérifier les permissions
export const hasPermission = (userRole: Role, path: string): boolean => {
  // Trouve la route protégée qui correspond au chemin
  const route = Object.keys(PROTECTED_ROUTES).find(route => 
    path.match(route)
  );


  if (!route) return true; // Si la route n'est pas protégée, accès autorisé

  const allowedRoles = PROTECTED_ROUTES[route as keyof typeof PROTECTED_ROUTES];
  return allowedRoles.includes(userRole);
}; 