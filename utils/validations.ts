export const isValidEmail = (email: string): boolean => {
  const match = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return !!match;
};

export const isEmail = (email: string): string | undefined => {
  return isValidEmail(email) ? undefined : "El correo no parece ser válido";
};

export const isValidPhone = (phone: string): boolean => {
  // Puedes personalizar la expresión regular según los formatos de teléfono que quieras permitir
  const match = String(phone).match(/^[0-9]{10}$/);
  return !!match;
};

export const isPhone = (phone: string): string | undefined => {
  return isValidPhone(phone) ? undefined : "Ingrese un número de teléfono válido";
};

export const isValidCurp = (curp: string): boolean => {
  const match = String(curp).match(
    /^[A-Z]{4}\d{6}[HM](AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS)[A-Z]{3}[A-Z0-9][0-9]$/
  );
  return !!match;
};

export const isCurp = (curp: string): string | undefined => {
  return isValidCurp(curp) ? undefined : "Ingrese una CURP válida";
};

export const isValidRfc = (rfc: string): boolean => {
  const match = String(rfc).match(/^[A-Za-z]{4}\d{6}[A-Za-z0-9]{3}$/);
  return !!match;
};

export const isRfc = (rfc: string): string | undefined => {
  return isValidRfc(rfc) ? undefined : "Ingrese un RFC válido";
};