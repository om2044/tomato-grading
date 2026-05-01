import React from 'react';

// Si l'utilisateur n'a pas le bon rôle, ce composant cache ce qu'il contient.
export default function RoleGuard({ userRole, allowedRoles, children }) {
  
  // On vérifie si le rôle de l'utilisateur fait partie des rôles autorisés
  const hasAccess = allowedRoles.includes(userRole);

  // S'il n'a pas accès, on ne renvoie rien (ça cache le composant)
  if (!hasAccess) {
    return null; 
  }

  // S'il a accès, on affiche ce qu'il y a à l'intérieur
  return <>{children}</>;
}