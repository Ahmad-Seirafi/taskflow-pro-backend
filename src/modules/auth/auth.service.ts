import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../middlewares/auth.js';
import jwt from 'jsonwebtoken';
import { msToMillis } from '../../utils/time.js'; // ✅ مهم: استيراد الدالة التي نستخدمها

/** Create user (checks email uniqueness) */
export async function registerUser(name: string, email: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw { status: 400, message: 'Email already in use' };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  return user;
}

/** Login and issue access/refresh JWTs */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };

  const accessToken = signJwt({ sub: user.id }, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES);
  const refreshToken = signJwt({ sub: user.id }, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES);

  const expiresAt = new Date(Date.now() + msToMillis(env.JWT_REFRESH_EXPIRES));
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
  return { user, accessToken, refreshToken };
}

/** Rotate refresh token: revoke old, create new */
export async function rotateRefreshToken(oldToken: string) {
  const rt = await prisma.refreshToken.findUnique({ where: { token: oldToken } });
  if (!rt || rt.revoked || rt.expiresAt < new Date()) throw { status: 401, message: 'Invalid refresh token' };

  const decoded = jwt.verify(oldToken, env.JWT_REFRESH_SECRET) as any;
  const newAccess = signJwt({ sub: decoded.sub }, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES);
  const newRefresh = signJwt({ sub: decoded.sub }, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES);

  await prisma.$transaction([
    prisma.refreshToken.update({ where: { token: oldToken }, data: { revoked: true } }),
    prisma.refreshToken.create({
      data: {
        token: newRefresh,
        userId: decoded.sub,
        expiresAt: new Date(Date.now() + msToMillis(env.JWT_REFRESH_EXPIRES))
      }
    })
  ]);
  return { accessToken: newAccess, refreshToken: newRefresh };
}
