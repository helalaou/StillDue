export const fields = [
 {id:'computer-science',name:'Computer science',subfields:[['AI','Artificial intelligence'],['HI','Human–computer interaction'],['SC','Security & privacy'],['SE','Software engineering'],['DB','Data management'],['DS','Architecture & systems'],['NW','Networking'],['CT','Theory'],['CG','Graphics'],['MX','Interdisciplinary']]},
 {id:'engineering',name:'Engineering',subfields:[['robotics','Robotics'],['electrical','Electrical engineering'],['mechanical','Mechanical engineering'],['civil','Civil engineering']]},
 {id:'life-sciences',name:'Life sciences',subfields:[['biology','Biology'],['medicine','Medicine'],['neuroscience','Neuroscience']]},
 {id:'physical-sciences',name:'Physical sciences',subfields:[['physics','Physics'],['chemistry','Chemistry'],['mathematics','Mathematics']]},
 {id:'social-sciences',name:'Social sciences',subfields:[['psychology','Psychology'],['economics','Economics'],['education','Education']]},
 {id:'humanities',name:'Humanities & arts',subfields:[['design','Design'],['history','History'],['languages','Languages']]},
 {id:'other',name:'Another field',subfields:[]},
] as const;
export const fieldName=(id:string)=>fields.find(f=>f.id===id)?.name||id;
export const subfieldName=(field:string,id:string)=>fields.find(f=>f.id===field)?.subfields.find(s=>s[0]===id)?.[1]||id;
