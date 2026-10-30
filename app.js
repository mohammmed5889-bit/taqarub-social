const $ = (id) => document.getElementById(id);
let language = 'ar';
let posts = [
  {id:1,name:'أحمد محمد',text:'مرحباً بكم في مجتمع تقارب 💜 بداية جديدة للتواصل والمشاركة!',likes:12,liked:false},
  {id:2,name:'سارة علي',text:'أجمل شيء في التواصل إننا نتشارك الأفكار والتجارب الجميلة.',likes:8,liked:false}
];
try { const saved = JSON.parse(localStorage.getItem('taqarub_posts') || 'null'); if (saved) posts = saved; } catch {}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2100)}
function save(){try{localStorage.setItem('taqarub_posts',JSON.stringify(posts))}catch{}}
function render(){
  $('posts').innerHTML = posts.map(p => `
    <article class="post">
      <div class="posthead"><div class="avatar">${p.name.slice(0,1)}</div><div><div class="postname">${escapeHtml(p.name)}</div><div class="posttime">${language==='ar'?'منشور في تقارب':'Posted on Taqarub'}</div></div></div>
      <div class="postbody">${escapeHtml(p.text)}</div>
      <div class="postactions">
        <button class="action ${p.liked?'liked':''}" data-like="${p.id}">${p.liked?'♥':'♡'} ${language==='ar'?'إعجاب':'Like'} · ${p.likes}</button>
        <button class="action" data-comment="${p.id}">▢ ${language==='ar'?'تعليق':'Comment'}</button>
      </div>
    </article>`).join('');
  document.querySelectorAll('[data-like]').forEach(b=>b.addEventListener('click',()=>{
    const p=posts.find(x=>x.id===Number(b.dataset.like));p.liked=!p.liked;p.likes+=p.liked?1:-1;save();render();
  }));
  document.querySelectorAll('[data-comment]').forEach(b=>b.addEventListener('click',()=>toast(language==='ar'?'التعليقات ستضاف بعد ربط قاعدة البيانات.':'Comments will be added after database setup.')));
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('publishBtn').addEventListener('click',()=>{
  const text=$('postText').value.trim();if(!text){toast(language==='ar'?'اكتب منشوراً أولاً.':'Write a post first.');return}
  posts.unshift({id:Date.now(),name:language==='ar'?'أنت':'You',text,likes:0,liked:false});$('postText').value='';save();render();toast(language==='ar'?'تمت إضافة المنشور على هذا الجهاز.':'Post added on this device.');
});
document.querySelectorAll('.navitem').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.navitem').forEach(x=>x.classList.toggle('active',x===b));
  document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===b.dataset.page));
}));
$('langBtn').addEventListener('click',()=>{
  language=language==='ar'?'en':'ar';document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';
  $('langBtn').textContent=language==='ar'?'English':'العربية';
  document.querySelectorAll('[data-ar]').forEach(el=>el.textContent=el.dataset[language]);
  $('postText').placeholder=language==='ar'?'بماذا تفكر اليوم؟':"What's on your mind?";
  $('publishBtn').textContent=language==='ar'?'نشر':'Post';render();
});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
render();
