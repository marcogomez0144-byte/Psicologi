(()=>{'use strict';
let d=window.SITE_CONTENT;
const preview=new URLSearchParams(location.search).get('preview')==='1';

if(preview){
  try{
    const x=JSON.parse(localStorage.getItem('psico-draft-v1'));
    if(x?.version===1)d=x;
  }catch{}
}
if(!d)return;

const s=d.settings||{};
const p=d.pages?.[document.body.dataset.page];
const replace=t=>String(t??'')
  .replaceAll('[NOMBRE]',s.name||'[NOMBRE]')
  .replaceAll('[CIUDAD]',s.city||'[CIUDAD]');

document.querySelectorAll('[data-text]').forEach(e=>{
  const x=p?.texts?.[e.dataset.text];
  if(x)e.textContent=replace(x.value);
});

// Por privacidad, las imágenes dinámicas solo pueden venir del propio sitio
// o estar embebidas como data:image. Se bloquean imágenes remotas de terceros.
const imageOK=u=>/^(data:image\/(jpeg|png|webp);base64,|(?:\.\.\/)?assets\/)/i.test(String(u||''));

document.querySelectorAll('[data-image]').forEach(e=>{
  const x=p?.images?.[e.dataset.image];
  if(x&&imageOK(x.src)){
    e.src=x.src;
    e.alt=x.alt||'';
  }
});

// Solo HTTPS para enlaces web externos; mailto/tel/anclas y rutas locales siguen permitidos.
const linkOK=u=>/^(https:\/\/|mailto:|tel:|#|(?:\.\.\/)?(?:assets|legal)\/)/i.test(String(u||''));

document.querySelectorAll('[data-link]').forEach(e=>{
  const x=p?.links?.[e.dataset.link];
  if(x&&linkOK(x.href)){
    e.href=x.href;
    if(/^https:\/\//i.test(x.href))e.rel='noopener noreferrer';
  }
});

if(/^#[0-9a-f]{6}$/i.test(s.accent||'')){
  document.documentElement.style.setProperty('--color-sage',s.accent);
  document.documentElement.style.setProperty('--accent',s.accent);
}

if(document.body.dataset.page==='index.html'){
  document.title=replace(s.title||document.title);
  const m=document.querySelector('meta[name=description]');
  if(m&&s.description)m.content=replace(s.description);
}
document.querySelectorAll('meta[property="og:title"]').forEach(x=>{
  if(s.title)x.content=replace(s.title);
});
document.querySelectorAll('meta[property="og:description"]').forEach(x=>{
  if(s.description)x.content=replace(s.description);
});

const phone=String(s.phone||'').replace(/\D/g,'');
document.querySelectorAll('a[href*="wa.me"]').forEach(a=>{
  if(phone.length>=9){
    a.href='https://wa.me/'+phone;
    a.rel='noopener noreferrer';
  }else{
    a.hidden=true;
  }
});

const c=document.querySelector('#contactChannels');
if(c){
  const add=(label,url)=>{
    const a=document.createElement('a');
    a.className='btn btn-primary';
    a.textContent=label;
    a.href=url;
    if(/^https:\/\//i.test(url))a.rel='noopener noreferrer';
    c.append(a);
  };
  if(phone.length>=9){
    add('Escribir por WhatsApp','https://wa.me/'+phone+'?text='+encodeURIComponent('Hola, me gustaría consultar disponibilidad para una primera cita.'));
  }
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email||'')){
    add('Enviar un correo','mailto:'+s.email);
  }
  if(/^https:\/\//i.test(s.bookingUrl||'')){
    add('Ver agenda y reservar',s.bookingUrl);
  }
  if(c.children.length){
    const notice=document.querySelector('#contactNotice');
    if(notice)notice.hidden=true;
  }
}

const g=document.querySelector('#articleList');
if(g){
  const articles=(Array.isArray(d.articles)?d.articles:[]).filter(a=>a&&a.published);
  const resources=document.querySelector('#recursos');
  if(!articles.length&&resources)resources.hidden=true;

  articles.forEach(a=>{
    const card=document.createElement('article');
    card.className='article-card';

    if(imageOK(a.image||'')){
      const i=document.createElement('img');
      i.src=a.image;
      i.alt=a.imageAlt||'';
      i.loading='lazy';
      card.append(i);
    }

    const h=document.createElement('h3');
    h.textContent=a.title||'';
    card.append(h);

    const t=document.createElement('p');
    t.textContent=a.excerpt||'';
    card.append(t);

    const det=document.createElement('details');
    const sum=document.createElement('summary');
    sum.textContent='Leer artículo';
    det.append(sum);

    const b=document.createElement('div');
    b.className='article-body';
    b.textContent=a.body||'';
    det.append(b);
    card.append(det);
    g.append(card);
  });
}

if(preview){
  const bar=document.createElement('div');
  bar.className='preview-banner';
  bar.textContent='Vista previa del borrador · Los visitantes no ven estos cambios';
  document.body.prepend(bar);
}
})();