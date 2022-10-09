import { TagToRoleMap } from './TagToRoleMap';

export const getRole = elem => {
  if (elem.role) return elem.role;
  const role = TagToRoleMap[elem.tagName.toLowerCase()];
  if (role instanceof Function) return role(elem);
  return role;
};