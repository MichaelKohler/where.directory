import type { Password, User } from "@prisma/client";
import bcrypt from "@node-rs/bcrypt";
import { createHash } from "crypto";

import { prisma } from "../db.server";

export type { User } from "@prisma/client";

const ONE_HOUR_MS = 1 * 60 * 60 * 1000;

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserByUsername(username: User["username"]) {
  return prisma.user.findUnique({ where: { username } });
}

export async function getUserIdByUsername(username: User["username"]) {
  return prisma.user.findUnique({ where: { username }, select: { id: true } });
}

export function countUsers() {
  return prisma.user.count();
}

export async function changeUsername(
  username: User["username"],
  userId: User["id"]
) {
  const existingUsername = await getUserIdByUsername(username);
  if (existingUsername) {
    throw new Error("USERNAME_ALREADY_EXISTS");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
    },
  });
}

export async function createUser(
  email: User["email"],
  password: string,
  username: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      username,
    },
  });
}

async function validatePasswordResetToken(token: string) {
  const hashedToken = createHash("sha256").update(token).digest("hex");

  const passwordResetEntry = await prisma.passwordReset.findUnique({
    where: { token: hashedToken },
  });

  if (
    !passwordResetEntry ||
    passwordResetEntry.createdAt.getTime() < Date.now() - ONE_HOUR_MS
  ) {
    throw new Error("PASSWORD_RESET_EXPIRED");
  }

  await prisma.passwordReset.delete({ where: { token: hashedToken } });

  return passwordResetEntry.email;
}

export async function changePassword(
  email: User["email"],
  password: string,
  token: string
) {
  let userEmail = email;

  if (!email && !token) {
    throw new Error("NO_EMAIL_OR_TOKEN_PASSED");
  }

  // If this is a password reset flow change, then we need to validate the token
  if (token) {
    userEmail = await validatePasswordResetToken(token);
  }

  const existingUser = await getUserByEmail(userEmail);
  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.password.update({
    where: {
      userId: existingUser.id,
    },
    data: {
      hash: hashedPassword,
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function deleteUserByUserId(id: User["id"]) {
  return prisma.user.delete({ where: { id } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
