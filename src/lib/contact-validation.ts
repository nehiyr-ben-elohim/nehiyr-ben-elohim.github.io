export type ContactFields = { name: string; email: string; message: string }
export type ContactErrors = Record<keyof ContactFields, boolean>

export const MIN_MESSAGE = 20

// true = invalid
export const validateContact = ({ name, email, message }: ContactFields): ContactErrors => ({
  name: !name.trim(),
  email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
  message: message.trim().length < MIN_MESSAGE,
})
