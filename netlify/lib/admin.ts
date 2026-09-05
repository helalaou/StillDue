import {createClient} from '@supabase/supabase-js';
export function adminClient(){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SECRET_KEY;if(!url||!key)throw new Error('Server database credentials are not configured.');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
export function emailReady(){return !!(process.env.RESEND_API_KEY&&process.env.EMAIL_FROM)}
