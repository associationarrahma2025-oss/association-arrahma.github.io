(() => {
  'use strict';
  const lists = [...document.querySelectorAll('[data-activities-list]')];
  if (!lists.length) return;
  const portal = 'https://arrahma-inscriptions.bluegrain32.chatgpt.site';
  const fallback = (list, text) => { list.replaceChildren(); const p=document.createElement('p'); p.className='activity-empty';p.textContent=text;list.appendChild(p);const a=document.createElement('a');a.href=portal;a.textContent='Ouvrir l’espace activités ↗';a.className='text-link';list.appendChild(a); };
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),9000);
  fetch(portal+'/api/activities',{credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal}).then(async response=>{
    if(!response.ok)throw Error();const items=await response.json();if(!Array.isArray(items))throw Error();
    lists.forEach(list=>{list.replaceChildren();if(!items.length){fallback(list,'Les prochaines activités se préparent. Aucune inscription n’est ouverte pour le moment.');return;}
      items.forEach(item=>{if(!item||typeof item.title!=='string'||!/^[a-zA-Z0-9-]{20,64}$/.test(item.id))return;const card=document.createElement('article');card.className='scheduled-activity';const category=document.createElement('span');category.className='eyebrow';category.textContent=item.category;const title=document.createElement('h3');title.textContent=item.title;const details=document.createElement('p');details.textContent=new Date(item.starts_at).toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'})+' · heure de Paris\n'+item.place;const description=document.createElement('p');description.textContent=item.description;const link=document.createElement('a');link.className='button button-primary';link.href=portal+'/inscription?activite='+encodeURIComponent(item.id);link.textContent='S’inscrire à cette activité ↗';card.append(category,title,details,description,link);list.appendChild(card);});
    });
  }).catch(()=>lists.forEach(list=>fallback(list,'Les activités ne peuvent pas être affichées ici pour le moment. Retrouvez-les dans l’espace activités.'))).finally(()=>clearTimeout(timer));
})();
