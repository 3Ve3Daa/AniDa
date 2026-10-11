import list from '../../electron/adblock.json';

// Общий источник блокировок (тот же файл читает Electron main).
export const ADBLOCK_HOSTS: string[] = Array.isArray((list as { hosts?: unknown }).hosts)
  ? ((list as { hosts: unknown[] }).hosts.map(String))
  : [];

export const ADBLOCK_CSS: string = String((list as { css?: unknown }).css ?? '');

// Активный JS: жмёт «Пропустить», глушит и ускоренно проматывает видео,
// рядом с которыми есть метка «Реклама» (до 4 уровней вверх).
// Основное видео без такой метки не трогаем. Прогон повторяется 60 секунд,
// чтобы ловить рекламу, подгруженную позже.
export const ADBLOCK_JS = `(function(){try{
function each(sel,fn){try{var l=document.querySelectorAll(sel);for(var i=0;i<l.length;i++){try{fn(l[i]);}catch(e){}}}catch(e){}}
function clickSkip(){each('button,a,[role="button"]',function(el){var t=((el.innerText||'').trim().toLowerCase());if(t==='пропустить'||t==='skip'||t==='skip ad'||t.indexOf('пропустить рекламу')===0||t.indexOf('пропустить через')===0){try{el.click();}catch(e){}}});}
function hasAdLabel(node){var p=node;for(var k=0;k<4&&p&&p!==document.body;k++){try{var t=(p.innerText||'').toLowerCase();if(t.length<400&&t.indexOf('реклама')>=0)return true;}catch(e){}p=p.parentElement;}return false;}
function hushAds(){each('video',function(v){try{if(hasAdLabel(v)){v.muted=true;try{if(v.playbackRate<8)v.playbackRate=16;}catch(e){}}}catch(e){}});}
function pass(){clickSkip();hushAds();}
pass();var n=0;var timer=setInterval(function(){n++;try{pass();}catch(e){}if(n>=30){try{clearInterval(timer);}catch(e){}}},2000);
}catch(e){}})();`;

// JS-сниппет для InAppBrowser executeScript: CSS + активные действия.
export function adblockInjectJS(): string {
  const css = ADBLOCK_CSS.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  // js вставляется как код (не строка) — экранировать нельзя.
  return `(function(){try{if(document.getElementById('anida-adblock'))return;var s=document.createElement('style');s.id='anida-adblock';s.textContent='${css}';(document.head||document.documentElement).appendChild(s);}catch(e){}try{${ADBLOCK_JS}}catch(e){}})();`;
}
