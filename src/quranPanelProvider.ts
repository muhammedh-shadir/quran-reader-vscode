import * as vscode from 'vscode';

function getNonce(): string {
  let text = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
  return text;
}

export class QuranPanelProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._getHtml(webviewView.webview);
  }

  private _getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const cspSrc = webview.cspSource;
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${cspSrc}; script-src 'nonce-${nonce}'; connect-src https://api.quran.com https://everyayah.com; font-src https://quran.com; media-src https://everyayah.com;">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
@font-face{font-family:'UthmanicHafs';src:url('https://quran.com/fonts/quran/hafs/uthmanic_hafs/UthmanicHafs1Ver18.woff2') format('woff2');font-weight:normal;font-style:normal;font-display:swap}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#0d1117;color:#e6edf3;font-size:13px;height:100vh;display:flex;flex-direction:column;overflow:hidden}
.hdr{background:#161b22;border-bottom:1px solid #30363d;padding:8px 10px;display:flex;align-items:center;gap:8px;flex-shrink:0}
.hdr-icon{width:18px;height:18px;background:#c9a84c;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:700}
.hdr-title{font-size:11px;font-weight:700;color:#e6c97a;letter-spacing:.5px;flex:1}
.tabs{display:flex;background:#161b22;border-bottom:1px solid #30363d;flex-shrink:0}
.tab{flex:1;padding:7px 4px;background:none;border:none;border-bottom:2px solid transparent;color:#8b949e;cursor:pointer;font-size:11px;font-weight:600;font-family:inherit}
.tab.on{color:#e6c97a;border-bottom-color:#c9a84c}
.content{flex:1;overflow-y:auto;min-height:0}
.loading{text-align:center;padding:40px 16px;color:#8b949e}
.spin{width:20px;height:20px;border:2px solid #30363d;border-top-color:#c9a84c;border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 10px}
@keyframes spin{to{transform:rotate(360deg)}}
.err{margin:10px;padding:10px;background:rgba(248,81,73,.12);border:1px solid rgba(248,81,73,.3);border-radius:6px;color:#f85149;font-size:11px;line-height:1.6}
.ch-item{display:flex;align-items:center;padding:8px 10px;border-bottom:1px solid #30363d;cursor:pointer;gap:8px;transition:background .15s}
.ch-item:hover{background:#1c2330}
.ch-num{width:24px;height:24px;background:#1c2330;border:1px solid #30363d;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#c9a84c;flex-shrink:0}
.ch-info{flex:1;min-width:0}
.ch-name{font-size:12px;font-weight:600}
.ch-meta{font-size:10px;color:#8b949e;margin-top:1px}
.ch-ar{font-size:17px;color:#f0e6c8;direction:rtl}
.vhdr{padding:8px 10px;background:#161b22;border-bottom:1px solid #30363d;display:flex;align-items:center;gap:8px;flex-shrink:0}
.back-btn{background:none;border:1px solid #30363d;color:#8b949e;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-family:inherit}
.back-btn:hover{border-color:#c9a84c;color:#c9a84c}
.vtitle{font-size:12px;font-weight:700;color:#e6c97a}
.vsub{font-size:10px;color:#8b949e}
.verse{padding:12px 10px;border-bottom:1px solid #30363d}
.vkeyrow{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.vkey{background:#1c2330;border:1px solid #30363d;border-radius:10px;padding:2px 7px;font-size:10px;color:#c9a84c;font-weight:700}
.play-btn{width:24px;height:24px;background:none;border:1px solid #30363d;border-radius:50%;color:#8b949e;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;transition:all .2s}
.play-btn:hover{border-color:#c9a84c;color:#c9a84c}
.play-btn.playing{border-color:#3fb950;color:#3fb950}
.ar{font-family:'UthmanicHafs',serif;font-size:22px;line-height:2;color:#f0e6c8;direction:rtl;text-align:right;margin-bottom:8px}
.translit{font-size:11px;color:#8b949e;font-style:italic;line-height:1.6;margin-bottom:6px}
.trans{font-size:12px;color:#e6edf3;line-height:1.7}
.juz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:8px}
.juz-card{background:#1c2330;border:1px solid #30363d;border-radius:7px;padding:10px 6px;text-align:center;cursor:pointer;transition:all .2s}
.juz-card:hover{border-color:#c9a84c}
.juz-n{font-size:18px;font-weight:700;color:#c9a84c}
.juz-l{font-size:10px;color:#8b949e;margin-top:2px}
.rand-wrap{padding:14px 10px}
.rand-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.rand-title{font-size:12px;font-weight:700;color:#e6c97a}
.refresh-btn{background:#1c2330;border:1px solid #30363d;color:#8b949e;padding:5px 9px;border-radius:5px;cursor:pointer;font-size:11px;font-family:inherit}
.refresh-btn:hover{border-color:#c9a84c;color:#c9a84c}
.rand-card{background:#161b22;border:1px solid #30363d;border-radius:9px;padding:14px;position:relative}
.rand-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,transparent)}
.sbar{padding:7px 10px;border-bottom:1px solid #30363d;display:flex;gap:5px;flex-shrink:0}
.sinput{flex:1;background:#1c2330;border:1px solid #30363d;border-radius:5px;padding:6px 9px;color:#e6edf3;font-size:12px;font-family:inherit;outline:none}
.sinput:focus{border-color:#c9a84c}
.sinput::placeholder{color:#8b949e}
.sbtn{background:#1c2330;border:1px solid #30363d;border-radius:5px;padding:6px 9px;color:#8b949e;cursor:pointer}
.sbtn:hover{border-color:#c9a84c;color:#c9a84c}
.sr-item{padding:10px;border-bottom:1px solid #30363d}
.sr-key{font-size:10px;color:#c9a84c;font-weight:700;margin-bottom:3px}
.sr-text{font-size:11px;color:#8b949e;line-height:1.5}
.pager{display:flex;justify-content:center;align-items:center;gap:8px;padding:10px;border-top:1px solid #30363d;flex-shrink:0}
.pg-btn{background:#1c2330;border:1px solid #30363d;color:#8b949e;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;font-family:inherit}
.pg-btn:hover:not(:disabled){border-color:#c9a84c;color:#c9a84c}
.pg-btn:disabled{opacity:.4;cursor:not-allowed}
.pg-info{font-size:11px;color:#8b949e}
.view{display:none;flex-direction:column;flex:1;min-height:0}
.view.active{display:flex}

.mode-toggle{display:flex;background:#0d1117;border:1px solid #30363d;border-radius:5px;overflow:hidden;flex-shrink:0}
.mode-btn{padding:3px 8px;background:none;border:none;color:#8b949e;cursor:pointer;font-size:10px;font-family:inherit;font-weight:600;transition:all .15s}
.mode-btn.on{background:#c9a84c;color:#000}
.reading-block{padding:0 10px 16px}
.reading-ar{font-family:'UthmanicHafs',serif;font-size:26px;line-height:2.2;color:#f0e6c8;direction:rtl;text-align:center;margin-bottom:12px}
.reading-ar .anum{display:inline-block;font-size:14px;color:#c9a84c;font-family:system-ui,sans-serif;vertical-align:middle;margin:0 4px}
.reading-trans{font-size:12px;color:#8b949e;line-height:1.8;border-top:1px solid #30363d;padding-top:12px;margin-top:4px}
.reading-trans p{margin-bottom:6px;padding-left:4px;border-left:2px solid #30363d}
.reading-trans p span{color:#c9a84c;font-size:10px;font-weight:700;margin-right:6px}
.surah-banner{text-align:center;padding:16px 10px 8px;border-bottom:1px solid #30363d;margin-bottom:0}
.surah-banner-ar{font-family:'UthmanicHafs',serif;font-size:28px;color:#f0e6c8;margin-bottom:4px}
.surah-banner-en{font-size:11px;color:#8b949e}
.bismillah{text-align:center;font-family:'UthmanicHafs',serif;font-size:22px;color:#e6c97a;padding:12px 10px;border-bottom:1px solid #30363d}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#0d1117}
::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px}
</style>
</head>
<body>
<div class="hdr"><div class="hdr-icon">&#9789;</div><span class="hdr-title">QURAN READER</span></div>
<div class="tabs">
  <button class="tab on" data-tab="surah">Surah</button>
  <button class="tab" data-tab="juz">Juz</button>
  <button class="tab" data-tab="random">Random</button>
  <button class="tab" data-tab="search">Search</button>
</div>

<div id="tab-surah" class="view active">
  <div id="chListView" class="content">
    <div class="loading" id="chLoad"><div class="spin"></div>Loading Surahs...</div>
    <div id="chList"></div>
  </div>
  <div id="versesView" style="display:none;flex-direction:column;flex:1;min-height:0">
    <div class="vhdr">
      <button class="back-btn" id="backV">Back</button>
      <div style="flex:1"><div class="vtitle" id="vTitle"></div><div class="vsub" id="vSub"></div></div>
      <div class="mode-toggle">
        <button class="mode-btn on" id="modeCard" title="Verse by Verse">&#9783;</button>
        <button class="mode-btn" id="modeRead" title="Reading Mode">&#9776;</button>
      </div>
    </div>
    <div class="content" id="versesList"></div>
    <div class="pager" id="sPager" style="display:none">
      <button class="pg-btn" id="sPrev">Prev</button>
      <span class="pg-info" id="sInfo"></span>
      <button class="pg-btn" id="sNext">Next</button>
    </div>
  </div>
</div>

<div id="tab-juz" class="view">
  <div id="juzListView" class="content">
    <div class="juz-grid" id="juzGrid"></div>
  </div>
  <div id="juzVV" style="display:none;flex-direction:column;flex:1;min-height:0">
    <div class="vhdr">
      <button class="back-btn" id="backJ">Back</button>
      <div style="flex:1"><div class="vtitle" id="juzTitle"></div></div>
      <div class="mode-toggle">
        <button class="mode-btn on" id="jModeCard" title="Verse by Verse">&#9783;</button>
        <button class="mode-btn" id="jModeRead" title="Reading Mode">&#9776;</button>
      </div>
    </div>
    <div class="content" id="juzList"></div>
    <div class="pager" id="jPager" style="display:none">
      <button class="pg-btn" id="jPrev">Prev</button>
      <span class="pg-info" id="jInfo"></span>
      <button class="pg-btn" id="jNext">Next</button>
    </div>
  </div>
</div>

<div id="tab-random" class="view">
  <div class="rand-wrap">
    <div class="rand-hdr">
      <span class="rand-title">Verse of the Moment</span>
      <button class="refresh-btn" id="refreshBtn">New Verse</button>
    </div>
    <div class="loading" id="randLoad"><div class="spin"></div>Loading...</div>
    <div id="randCard" class="rand-card" style="display:none"></div>
  </div>
</div>

<div id="tab-search" class="view" style="flex-direction:column">
  <div class="sbar">
    <input class="sinput" id="sInput" placeholder="Search the Quran...">
    <button class="sbtn" id="sBtn">Search</button>
  </div>
  <div class="content" id="sResults"></div>
</div>

<audio id="audio"></audio>

<script nonce="${nonce}">
(function() {
  var BASE = 'https://api.quran.com/api/v4';
  var TRANS = 20;
  var chapters = [];
  var curCh = null, curPage = 1, totPages = 1;
  var curJuz = null, juzPage = 1, juzTot = 1, juzReadMode = false;
  var playKey = null;
  var juzLoaded = false, randLoaded = false;
  var readMode = false;

  function G(id) { return document.getElementById(id); }

  function apiFetch(path, onOk, onFail) {
    fetch(BASE + path)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(onOk)
      .catch(function(e) {
        console.error('QuranReader fetch error:', path, e.message);
        if (onFail) onFail(e.message);
      });
  }

  function showErr(msg, el) {
    el.innerHTML = '<div class="err">Error: ' + msg + '</div>';
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function stripTags(s) {
    return (s || '').replace(/<[^>]*>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }

  // TABS
  document.querySelectorAll('.tab').forEach(function(t) {
    t.addEventListener('click', function() {
      document.querySelectorAll('.tab').forEach(function(x) { x.classList.remove('on'); });
      t.classList.add('on');
      document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
      var tid = t.getAttribute('data-tab');
      G('tab-' + tid).classList.add('active');
      if (tid === 'juz' && !juzLoaded) { juzLoaded = true; loadJuzList(); }
      if (tid === 'random' && !randLoaded) { randLoaded = true; loadRandom(); }
    });
  });

  // CHAPTERS
  function loadChapters() {
    apiFetch('/chapters?language=en', function(data) {
      chapters = data.chapters;
      G('chLoad').style.display = 'none';
      var html = '';
      for (var i = 0; i < chapters.length; i++) {
        var ch = chapters[i];
        var tname = (ch.translated_name||ch.translatedName) && (ch.translated_name||ch.translatedName).name ? (ch.translated_name||ch.translatedName).name : '';
        html += '<div class="ch-item" data-id="' + ch.id + '">' +
          '<div class="ch-num">' + ch.id + '</div>' +
          '<div class="ch-info"><div class="ch-name">' + (ch.name_simple||ch.nameSimple) + (tname ? ' &middot; ' + tname : '') + '</div>' +
          '<div class="ch-meta">' + (ch.verses_count||ch.versesCount) + ' verses &middot; ' + cap(ch.revelation_place||ch.revelationPlace) + '</div></div>' +
          '<div class="ch-ar" translate="no">' + (ch.name_arabic||ch.nameArabic) + '</div></div>';
      }
      G('chList').innerHTML = html;
      G('chList').querySelectorAll('.ch-item').forEach(function(el) {
        el.addEventListener('click', function() { openChapter(parseInt(el.getAttribute('data-id'))); });
      });
    }, function(e) { showErr(e, G('chLoad')); });
  }

  function openChapter(id) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === id) { curCh = chapters[i]; break; }
    }
    curPage = 1;
    G('chListView').style.display = 'none';
    G('versesView').style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0';
    var tname = (curCh.translated_name||curCh.translatedName) && (curCh.translated_name||curCh.translatedName).name ? (curCh.translated_name||curCh.translatedName).name : '';
    G('vTitle').textContent = (curCh.name_simple||curCh.nameSimple) + (tname ? ' - ' + tname : '');
    G('vSub').textContent = 'Surah ' + id + ' - ' + (curCh.verses_count||curCh.versesCount) + ' verses';
    G('sPager').style.display = 'none';
    loadVerses(id, 1);
  }

  function loadVerses(ch, page) {
    G('versesList').innerHTML = '<div class="loading"><div class="spin"></div>Loading...</div>';
    apiFetch('/verses/by_chapter/' + ch + '?language=en&translations=' + TRANS + '&fields=text_uthmani&word_fields=transliteration&page=' + page + '&per_page=10',
      function(data) {
        var p = data.pagination;
        curPage = p.current_page||p.currentPage; totPages = p.total_pages||p.totalPages;
        G('versesList').innerHTML = versesHtml(data.verses);
        attachPlay(G('versesList'));
        G('sPager').style.display = 'flex';
        G('sPrev').disabled = curPage <= 1;
        G('sNext').disabled = curPage >= totPages;
        G('sInfo').textContent = 'Page ' + curPage + ' / ' + totPages;
      },
      function(e) { showErr(e, G('versesList')); }
    );
  }

  G('modeCard').addEventListener('click', function() {
    if (readMode) { readMode = false; G('modeCard').classList.add('on'); G('modeRead').classList.remove('on'); loadVerses(curCh.id, 1); }
  });
  G('modeRead').addEventListener('click', function() {
    if (!readMode) { readMode = true; G('modeRead').classList.add('on'); G('modeCard').classList.remove('on'); loadAllVerses(curCh.id); }
  });

  function loadAllVerses(ch) {
    G('versesList').innerHTML = '<div class="loading"><div class="spin"></div>Loading full surah...</div>';
    G('sPager').style.display = 'none';
    var allVerses = [];
    var perPage = 50;
    function fetchPage(page) {
      apiFetch('/verses/by_chapter/' + ch + '?language=en&translations=' + TRANS + '&fields=text_uthmani&page=' + page + '&per_page=' + perPage,
        function(data) {
          allVerses = allVerses.concat(data.verses);
          var p = data.pagination;
          var tot = p.total_pages||p.totalPages;
          var cur = p.current_page||p.currentPage;
          if (cur < tot) { fetchPage(cur + 1); }
          else { G('versesList').innerHTML = readingHtml(ch, allVerses); }
        },
        function(e) { showErr(e, G('versesList')); }
      );
    }
    fetchPage(1);
  }

  function readingHtml(chId, verses) {
    // Build flowing Arabic text block + translation block
    var arHtml = '';
    var transHtml = '';
    // Show bismillah for all surahs except 9
    var showBismillah = chId !== 9;
    for (var i = 0; i < verses.length; i++) {
      var v = verses[i];
      var key = v.verse_key || v.verseKey || '';
      var num = key.split(':')[1] || (i+1);
      var ar = v.text_uthmani || v.textUthmani || '';
      var trans = (v.translations && v.translations[0]) ? stripTags(v.translations[0].text) : '';
      arHtml += ar + ' <span class="anum">&#' + (0x06F0 + parseInt(num)) + ';</span> ';
      transHtml += '<p><span>' + key + '</span>' + trans + '</p>';
    }
    var bismillah = showBismillah && chId !== 1 ? '<div class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>' : '';
    return bismillah +
      '<div class="reading-block">' +
        '<div class="reading-ar" translate="no">' + arHtml + '</div>' +
        '<div class="reading-trans">' + transHtml + '</div>' +
      '</div>';
  }

  G('backV').addEventListener('click', function() {
    G('versesView').style.display = 'none';
    G('chListView').style.display = 'block';
    stopAudio();
    readMode = false; G('modeCard').classList.add('on'); G('modeRead').classList.remove('on');
  });
  G('sPrev').addEventListener('click', function() { if (curPage > 1) loadVerses(curCh.id, curPage - 1); });
  G('sNext').addEventListener('click', function() { if (curPage < totPages) loadVerses(curCh.id, curPage + 1); });

  // JUZ
  function loadJuzList() {
    G('juzGrid').innerHTML = '<div class="loading" style="grid-column:1/-1"><div class="spin"></div>Loading...</div>';
    apiFetch('/juzs', function(data) {
      var html = '';
      // Deduplicate by juz_number (API returns 60 entries instead of 30)
      var seen = {};
      for (var i = 0; i < data.juzs.length; i++) {
        var j = data.juzs[i];
        var n = j.juz_number || j.juzNumber;
        if (seen[n]) continue;
        seen[n] = true;
        html += '<div class="juz-card" data-juz="' + n + '"><div class="juz-n">' + n + '</div><div class="juz-l">Juz</div></div>';
      }
      G('juzGrid').innerHTML = html;
      G('juzGrid').querySelectorAll('.juz-card').forEach(function(el) {
        el.addEventListener('click', function() { openJuz(parseInt(el.getAttribute('data-juz'))); });
      });
    }, function(e) { showErr(e, G('juzGrid')); });
  }

  function openJuz(n) {
    curJuz = n; juzPage = 1;
    G('juzListView').style.display = 'none';
    G('juzVV').style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0';
    G('juzTitle').textContent = 'Juz ' + n;
    G('jPager').style.display = 'none';
    loadJuzVerses(n, 1);
  }

  function loadJuzVerses(juz, page) {
    G('juzList').innerHTML = '<div class="loading"><div class="spin"></div>Loading...</div>';
    apiFetch('/verses/by_juz/' + juz + '?language=en&translations=' + TRANS + '&fields=text_uthmani&word_fields=transliteration&page=' + page + '&per_page=10',
      function(data) {
        var p = data.pagination;
        juzPage = p.current_page||p.currentPage; juzTot = p.total_pages||p.totalPages;
        G('juzList').innerHTML = versesHtml(data.verses);
        attachPlay(G('juzList'));
        G('jPager').style.display = 'flex';
        G('jPrev').disabled = juzPage <= 1;
        G('jNext').disabled = juzPage >= juzTot;
        G('jInfo').textContent = 'Page ' + juzPage + ' / ' + juzTot;
      },
      function(e) { showErr(e, G('juzList')); }
    );
  }

  G('jModeCard').addEventListener('click', function() {
    if (juzReadMode) { juzReadMode = false; G('jModeCard').classList.add('on'); G('jModeRead').classList.remove('on'); loadJuzVerses(curJuz, 1); }
  });
  G('jModeRead').addEventListener('click', function() {
    if (!juzReadMode) { juzReadMode = true; G('jModeRead').classList.add('on'); G('jModeCard').classList.remove('on'); loadAllJuzVerses(curJuz); }
  });

  function loadAllJuzVerses(juz) {
    G('juzList').innerHTML = '<div class="loading"><div class="spin"></div>Loading full Juz...</div>';
    G('jPager').style.display = 'none';
    var allVerses = [];
    function fetchPage(page) {
      apiFetch('/verses/by_juz/' + juz + '?language=en&translations=' + TRANS + '&fields=text_uthmani&page=' + page + '&per_page=50',
        function(data) {
          allVerses = allVerses.concat(data.verses);
          var p = data.pagination;
          var tot = p.total_pages||p.totalPages;
          var cur = p.current_page||p.currentPage;
          if (cur < tot) { fetchPage(cur + 1); }
          else { G('juzList').innerHTML = juzReadingHtml(allVerses); }
        },
        function(e) { showErr(e, G('juzList')); }
      );
    }
    fetchPage(1);
  }

  function juzReadingHtml(verses) {
    // Group verses by surah for display
    var groups = [];
    var curGroup = null;
    for (var i = 0; i < verses.length; i++) {
      var v = verses[i];
      var key = v.verse_key || v.verseKey || '';
      var parts = key.split(':');
      var chNum = parseInt(parts[0]);
      var vNum = parseInt(parts[1]);
      if (!curGroup || curGroup.ch !== chNum) {
        curGroup = {ch: chNum, verses: []};
        groups.push(curGroup);
      }
      curGroup.verses.push(v);
    }
    var html = '';
    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g];
      html += '<div style="border-top:1px solid #30363d;padding:8px 10px 4px;">' +
        '<span class="vtitle">Surah ' + grp.ch + '</span></div>';
      var arHtml = '';
      var transHtml = '';
      for (var i = 0; i < grp.verses.length; i++) {
        var v = grp.verses[i];
        var key2 = v.verse_key || v.verseKey || '';
        var num = key2.split(':')[1] || (i+1);
        var ar = v.text_uthmani || v.textUthmani || '';
        var trans = (v.translations && v.translations[0]) ? stripTags(v.translations[0].text) : '';
        arHtml += ar + ' <span class="anum">&#' + (0x06F0 + parseInt(num)) + ';</span> ';
        transHtml += '<p><span>' + key2 + '</span>' + trans + '</p>';
      }
      html += '<div class="reading-block">' +
        '<div class="reading-ar" translate="no">' + arHtml + '</div>' +
        '<div class="reading-trans">' + transHtml + '</div>' +
        '</div>';
    }
    return html;
  }

  G('backJ').addEventListener('click', function() {
    G('juzVV').style.display = 'none';
    G('juzListView').style.display = 'block';
    stopAudio();
    juzReadMode = false; G('jModeCard').classList.add('on'); G('jModeRead').classList.remove('on');
  });
  G('jPrev').addEventListener('click', function() { if (juzPage > 1) loadJuzVerses(curJuz, juzPage - 1); });
  G('jNext').addEventListener('click', function() { if (juzPage < juzTot) loadJuzVerses(curJuz, juzPage + 1); });

  // RANDOM
  function loadRandom() {
    G('randLoad').style.display = 'block';
    G('randCard').style.display = 'none';
    apiFetch('/verses/random?language=en&translations=' + TRANS + '&fields=text_uthmani&word_fields=transliteration',
      function(data) {
        G('randLoad').style.display = 'none';
        G('randCard').style.display = 'block';
        G('randCard').innerHTML = verseHtml(data.verse);
        attachPlay(G('randCard'));
      },
      function(e) { showErr(e, G('randLoad')); }
    );
  }
  G('refreshBtn').addEventListener('click', loadRandom);

  // SEARCH
  G('sBtn').addEventListener('click', doSearch);
  G('sInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') doSearch(); });
  function doSearch() {
    var q = G('sInput').value.trim();
    if (!q) return;
    G('sResults').innerHTML = '<div class="loading"><div class="spin"></div>Searching...</div>';
    apiFetch('/search?q=' + encodeURIComponent(q) + '&size=10&page=0&language=en',
      function(data) {
        var verses = (data.result && data.result.verses) ? data.result.verses : [];
        if (!verses.length) { G('sResults').innerHTML = '<div class="loading">No results found</div>'; return; }
        var html = '';
        for (var i = 0; i < verses.length; i++) {
          var v = verses[i];
          html += '<div class="sr-item"><div class="sr-key">' + (v.verse_key || v.verseKey || '') + '</div><div class="sr-text">' + stripTags(v.text || '') + '</div></div>';
        }
        G('sResults').innerHTML = html;
      },
      function(e) { showErr(e, G('sResults')); }
    );
  }

  // VERSE HTML
  function versesHtml(verses) {
    var html = '';
    for (var i = 0; i < verses.length; i++) {
      html += '<div class="verse">' + verseHtml(verses[i]) + '</div>';
    }
    return html;
  }

  function verseHtml(v) {
    var key = v.verse_key || v.verseKey || '';
    var ar = v.text_uthmani || v.textUthmani || '';
    var translit = '';
    if (v.words) {
      for (var i = 0; i < v.words.length; i++) {
        var w = v.words[i];
        if (w.transliteration && w.transliteration.text) {
          translit += (translit ? ' ' : '') + w.transliteration.text;
        }
      }
    }
    var trans = (v.translations && v.translations[0]) ? stripTags(v.translations[0].text) : '';
    return '<div class="vkeyrow"><span class="vkey">' + key + '</span>' +
      '<button class="play-btn" data-key="' + key + '">&#9654;</button></div>' +
      (ar ? '<div class="ar" translate="no">' + ar + '</div>' : '') +
      (translit ? '<div class="translit">' + translit + '</div>' : '') +
      (trans ? '<div class="trans">' + trans + '</div>' : '<div class="trans" style="color:#8b949e">No translation loaded</div>');
  }

  function attachPlay(container) {
    container.querySelectorAll('.play-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-key');
        if (playKey === key) { stopAudio(); return; }
        var parts = key.split(':');
        var url = 'https://everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/' +
          parts[0].padStart(3,'0') + parts[1].padStart(3,'0') + '.mp3';
        stopAudio();
        playKey = key;
        btn.innerHTML = '&#9646;&#9646;';
        btn.classList.add('playing');
        var audio = G('audio');
        audio.src = url;
        audio.play().catch(function() {
          btn.innerHTML = '&#9654;'; btn.classList.remove('playing'); playKey = null;
        });
        audio.onended = function() {
          btn.innerHTML = '&#9654;'; btn.classList.remove('playing'); playKey = null;
        };
      });
    });
  }

  function stopAudio() {
    var audio = G('audio');
    audio.pause(); audio.src = '';
    if (playKey) {
      var btn = document.querySelector('.play-btn[data-key="' + playKey + '"]');
      if (btn) { btn.innerHTML = '&#9654;'; btn.classList.remove('playing'); }
      playKey = null;
    }
  }

  loadChapters();
})();
</script>
</body>
</html>`;
  }
}
