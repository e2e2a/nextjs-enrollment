"use server"
import { handlers } from "@/auth";
import dbConnect from "@/lib/db/db";
const initialized = async () => {
    await dbConnect();
}
initialized()
export const { GET, POST } = handlers