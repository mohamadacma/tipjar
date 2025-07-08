import { PrismaClient } from '../generated/prisma';


const prisma = new PrismaClient();

export async function saveTip(amount: number, message: string) {
  return prisma.tip.create({
    data: { amount, message },
  });
}
