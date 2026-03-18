import 'dotenv/config'
import argon2 from 'argon2'
export const hashPassword = async (password) => {
  const pepper = process.env.PASSWORD_PEPPER

  return await argon2.hash(password + pepper, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
  })
}

export const verifyPassword = async (password, hash) => {
  const pepper = process.env.PASSWORD_PEPPER
  return await argon2.verify(hash, password + pepper)
}