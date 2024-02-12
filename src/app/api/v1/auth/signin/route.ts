import { sha1 } from "@/lib/auth-helper";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const GET = async (req: Request) => {
    return Response.json({ message: "Not authenticated" }, { status: 401 })
}


export const POST = async (req: Request) => {
    let data = await req.body?.getReader().read();
    let jsonString = new TextDecoder().decode(data?.value);
    let { email, password } = JSON.parse(jsonString);

    const user = await prisma.user.findFirst({
        where: {
            email: email,
            password: sha1(password)
        }
    });

    if (user)
        return Response.json({ user: user }, { status: 200 })
    else return Response.json({ user: null }, { status: 401 })
}