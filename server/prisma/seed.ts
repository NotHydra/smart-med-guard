import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma: PrismaClient = new PrismaClient();

async function main(): Promise<void> {
    await prisma.user.create({
        data: {
            email: "rizky.irswanda115@gmail.com",
            password: await bcrypt.hash("123123123", 12),
        },
    });
}

main()
    .then(async (): Promise<void> => {
        await prisma.$disconnect();
    })
    .catch(async (e: Error): Promise<void> => {
        console.error(e);

        await prisma.$disconnect();

        process.exit(1);
    });
