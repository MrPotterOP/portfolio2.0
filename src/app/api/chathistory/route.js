import prisma from '@/lib/prisma';
import {NextResponse} from 'next/server';
import { ObjectId } from 'bson';

const upsertChat = async (userId) => {
    const chat = await prisma.Chat.upsert({
        where: {
            userId,
        },
        create: {
            userId,
        },
        update: {},
        include: {
            messages: true
        }
    });
    return chat;
};

const generateBsonId = (userId) =>{
    if(ObjectId.isValid(userId)){
        return userId;
    }else {
        return new ObjectId();
    }
}



export async function POST(req) {

    const { clientId } = await req.json();

    if (!clientId) return NextResponse.json({msg: 'Invalid userId'}, { status: 400 });

    const userId = generateBsonId(clientId);

    try {
        const chat = await upsertChat(userId);
        const chatHistory = chat.messages.map(message => {
            return {
                role: message.role,
                content: message.content
            }
        });

        return NextResponse.json({ chatHistory, clientId: userId }, { status: 200 });

    }catch(e){
        console.log(e);
        return NextResponse.json({msg: 'Error creating user'}, { status: 500 });
    }


}