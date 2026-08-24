import type {Deadline} from './types';
const escape=(s:string)=>s.replace(/\/g,'\\').replace(/
/g,'\n').replace(/,/g,'\,').replace(/;/g,'\;');
const stamp=(s:string)=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
export function exportIcs(items:Deadline[]){const rows=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//StillDue//Deadlines//EN','CALSCALE:GREGORIAN'];for(const d of items){if(!d.dueAt||d.status==='trash')continue;rows.push('BEGIN:VEVENT',`UID:${d.id}@stilldue`,`DTSTAMP:${stamp(d.updatedAt)}`,`DTSTART:${stamp(d.dueAt)}`,`SUMMARY:${escape(d.title)}`,`DESCRIPTION:${escape([d.nextAction,d.notes,'Source timezone: '+d.timezone,d.certainty==='estimated'?'ESTIMATED DATE':''].filter(Boolean).join('
'))}`,'END:VEVENT')}rows.push('END:VCALENDAR');return rows.join('
')+'
'}
