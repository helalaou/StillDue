import {adminClient} from './admin';
export async function authenticatedUser(request:Request){const token=request.headers.get('Authorization')?.replace(/^Bearer /,'');if(!token)throw new Error('Unauthorized');const client=adminClient();const {data,error}=await client.auth.getUser(token);if(error||!data.user)throw new Error('Unauthorized');return {user:data.user,client}}
export function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}})}
