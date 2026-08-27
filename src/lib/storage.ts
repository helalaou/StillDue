import type {Workspace} from '../domain/types';import {demoWorkspace} from '../domain/demo';
const DEMO='stilldue:demo:v1';
export function loadDemo():Workspace{try{const raw=localStorage.getItem(DEMO);if(raw){const w=JSON.parse(raw);if(Array.isArray(w.deadlines)&&Array.isArray(w.boards)&&w.preferences)return w}}catch{/* An unavailable or damaged demo cache should not prevent a fresh demo. */}return demoWorkspace()}
export function saveDemo(w:Workspace){localStorage.setItem(DEMO,JSON.stringify(w))}
export function cacheWorkspace(userId:string,w:Workspace){try{localStorage.setItem('stilldue:cache:'+userId,JSON.stringify(w))}catch{/* Online data remains authoritative if local storage is full. */}}
export function cachedWorkspace(userId:string):Workspace|null{try{return JSON.parse(localStorage.getItem('stilldue:cache:'+userId)||'null')}catch{return null}}
export function clearPrivateCache(userId:string){localStorage.removeItem('stilldue:cache:'+userId);for(const key of Object.keys(localStorage)){if(key.startsWith('stilldue:draft:'+userId))localStorage.removeItem(key)}}
