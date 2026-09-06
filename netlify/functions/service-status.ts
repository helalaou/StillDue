import {json} from '../lib/auth';import {emailReady} from '../lib/admin';
export default async function(){return json({emailReminders:emailReady(),authEmail:process.env.AUTH_EMAIL_READY==='true'})}
