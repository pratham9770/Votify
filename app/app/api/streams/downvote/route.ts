import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { prismaClient } from '@/app/lib/db';

const UpvoteSchema=z.object({
    streamId:z.string()
});
export async function POST(req: NextRequest) {
const session=await getServerSession();
const user=await prismaClient.user.findFirst({
    where:{
        email:session?.user?.email?? ""
    }
});
if(!user){
    return NextResponse.json({
        message:"User not found"},
        {
            status:403
        });
        

}
try{
    const data=UpvoteSchema.parse(await req.json());
    await prismaClient.upvote.delete({
        where:{
            userId_streamId:{
                userId:user.id,
            streamId:data.streamId

            }
            

        }
});

}
catch(e){
    console.log(e);
    return NextResponse.json({
        message:"Error while downvoting"},
        {
            status:403
        });

}
}

    
