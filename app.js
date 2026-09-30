"use strict";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let motionPaused = motionQuery.matches;
let channelIndex = 0;
let dialRotation = 0;
let entryIndex = 0;
let photoIndex = 0;

const channels = [
  { id: "voice", icon: "∿", photo: "portrait-piano.jpg", alt: "夕阳映入窗内，坐在钢琴前的个人照片", label: "声音之外，也有音乐。", kicker: "VOICE / 表达练习", title: "让声音，\n有自己的温度。", description: "从早功、朗诵到自媒体创作，练习把感受变成表达。也在音乐里，听见语言之外的情绪。", footnote: "播音主持 · 朗诵 · 自媒体创作" },
  { id: "language", icon: "Aa", photo: "portrait-kyoto.jpg", alt: "在京都金阁寺前阅读手中纸张的个人照片", label: "从一句问候，走向更大的世界。", kicker: "LANGUAGE / 打开一扇窗", title: "把世界，\n多读懂一点。", description: "把普通的一天写成英语日记，在播客里练习倾听，再从 Hola 开始学习西班牙语。想和更多地方的人自在交谈。", footnote: "英语学习 · 西班牙语学习 · 好奇心" },
  { id: "travel", icon: "↗", photo: "portrait-sea.jpg", alt: "蓝天与海港前，站在栏杆边的个人照片", label: "带着行李箱，也带着好奇心。", kicker: "ON THE ROAD / 自己出发", title: "去别处，\n也走近自己。", description: "从十七岁第一次独自去南京，到更多城市里的散步、聊天与寻味。喜欢自己决定路线，也喜欢计划之外的相遇。", footnote: "行李箱 · City walk · 新的相遇" },
  { id: "life", icon: "◌", photo: "portrait-snow.jpg", alt: "在雪人旁喝饮料的冬日生活照片", label: "日常的小事，也值得认真。", kicker: "EVERYDAY / 好好生活", title: "身体在动，\n生活也在前进。", description: "打一场羽毛球，骑一段路，完成一次训练，再好好吃饭。学习和运动，让普通的一天有了踏实的节奏。", footnote: "羽毛球 · 自行车 · 健身 · 好好吃饭" },
];

const entries = [
  { date: "2025.02.20 / PERSISTENCE", title: "我最理想的生活状态", quote: "阅读、锻炼、好好吃饭、充足的睡眠、音乐、与人交流、学习，这正是我最理想的生活状态", paragraphs: ["这一天的日记，写到了喜欢的现代汉语课程，也写到了想要开始学习西班牙语的念头。课堂、阅读、运动和音乐，逐渐拼出一种自己向往的日常。", "从这些记录里留下的，是一个简单的愿望：让生活里，多一些真正喜欢并愿意坚持的事情。"], source: "来源：Notion · Journal · 2025 年 2 月 20 日。引文保留原文，其余为内容整理；标题为主页编辑标题。" },
  { date: "2025.02.23 / A SMALL BEGINNING", title: "用英语，记下普通的一天", paragraphs: ["为了给英语写作创造更多练习机会，我决定开始用英语写日记，先给自己七天的尝试。", "第一次动笔，比预想中慢，也更难。写下家里的早餐、回学校的行李箱、和球友一起打羽毛球的时间——原来普通的一天，也能成为语言练习的材料。", "想把词汇真正用起来，就从自己的生活开始。"], source: "来源：Notion · Journal · 2025 年 2 月 23 日。以上为中文摘意，非原文逐字引用；省略与主题无关的私人细节。" },
  { date: "2025.06.12 / GO FOR IT", title: "向第三种语言出发", quote: "I want to be a Trilingual person!", paragraphs: ["从最初自学西班牙语，到这一天决定参加线下课程，学习第三种语言的想法，开始有了更具体的行动。", "不用等到一切都准备完美。从字母、发音和第一句问候开始，让热爱一点点变成能力。"], source: "来源：Notion · Journal · 2025 年 6 月 12 日 · Final Decision of Learning Spanish。英文为原文摘录，中文为内容整理。这是学习目标，不代表已经熟练掌握三种语言。" },
  { date: "2025.01.15 / CITY WALK", title: "重新认识一座城市", quote: "冬日的暖阳撒到脸颊上，暖暖。", paragraphs: ["再次抵达关西机场，熟悉的机场快线、冬日的阳光，让旅程有了轻松的开场。", "梅田颠覆了我对大阪原先的印象：高楼、年轻人，以及充满活力的街道。吃过大阪烧后，继续熟悉的 City walk，走到夜晚的中之岛。", "安静的河岸和低调的城市灯光，让我愿意停下来多看一会儿。原来来过的地方，也总能重新认识。"], source: "来源：Notion · Journal · 2025 年 1 月 15 日 · Third time in Japan。引文保留原文，其余为内容整理。" },
];

const photos = [
  { file: "portrait-sea.jpg", caption: "把自己交给蓝天", alt: "蓝天、海港和桥梁前的个人照片" },
  { file: "portrait-snow.jpg", caption: "冬天的一点可爱", alt: "与戴着围巾的雪人在一起的冬日照片" },
  { file: "portrait-garden.jpg", caption: "走慢一点，也很好", alt: "绿树与传统园林建筑前的个人照片" },
  { file: "portrait-piano.jpg", caption: "给日落一段旋律", alt: "夕阳下的钢琴与个人侧影" },
];

function setText(selector, value) { $(selector).textContent = value; }

function updateMotion() {
  document.documentElement.classList.toggle("motion-paused", motionPaused);
  $("#motion-toggle").setAttribute("aria-pressed", String(motionPaused));
  $("#motion-toggle").innerHTML = motionPaused ? '<span aria-hidden="true">▷</span> 开启动效' : '<span aria-hidden="true">Ⅱ</span> 暂停动效';
  if (!motionPaused) startDrawing();
}

function activateChannel(index) {
  const previous = channelIndex;
  channelIndex = (index + channels.length) % channels.length;
  const channel = channels[channelIndex];
  dialRotation += ((channelIndex - previous + 4) % 4) * 90;
  $("#dial-pointer").style.transform = `rotate(${dialRotation}deg)`;
  $(".tuner").dataset.mode = channel.id;
  setText("#channel-number", `FM 0${channelIndex + 1}`);
  setText("#dial-icon", channel.icon);
  $("#dial-icon").style.fontSize = channel.id === "language" ? "30px" : "";
  const photo = $("#channel-photo");
  photo.src = `assets/${channel.photo}`;
  photo.alt = channel.alt;
  setText("#channel-image-label", channel.label);
  setText("#channel-kicker", channel.kicker);
  $("#channel-title").replaceChildren();
  channel.title.split("\n").forEach((line, i) => {
    if (i) $("#channel-title").append(document.createElement("br"));
    $("#channel-title").append(document.createTextNode(line));
  });
  setText("#channel-description", channel.description);
  setText("#channel-footnote", channel.footnote);
  $$("[data-channel]").forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === channelIndex));
    tab.tabIndex = i === channelIndex ? 0 : -1;
  });
  $("#channel-panel").setAttribute("aria-labelledby", `tab-${channel.id}`);
  drawFrequency(performance.now());
}

function keyboardTabs(selector, callback, vertical = false) {
  const tabs = $$(selector);
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      const back = vertical ? "ArrowUp" : "ArrowLeft";
      const next = vertical ? "ArrowDown" : "ArrowRight";
      let target = index;
      if (event.key === back) target = (index + tabs.length - 1) % tabs.length;
      else if (event.key === next) target = (index + 1) % tabs.length;
      else if (event.key === "Home") target = 0;
      else if (event.key === "End") target = tabs.length - 1;
      else return;
      event.preventDefault();
      callback(target);
      tabs[target].focus();
    });
  });
}

const canvas = $("#frequency-canvas");
const context = canvas.getContext("2d");
let canvasWidth = 0;
let canvasHeight = 0;
let frame = null;
let canvasVisible = false;
let pointerAmount = 0;

function sizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawFrequency(performance.now());
}

function drawFrequency(now) {
  const time = motionPaused ? 1 : now / 1000;
  const w = canvasWidth, h = canvasHeight;
  context.clearRect(0, 0, w, h);
  if (!w || !h) return;
  context.strokeStyle = "#768866";
  context.fillStyle = "#657a53";
  context.lineWidth = 1;
  if (channelIndex === 0) {
    const count = Math.max(14, Math.floor(w / 6));
    for (let i = 0; i < count; i++) {
      const x = (i + .5) * w / count;
      const envelope = Math.sin(i / count * Math.PI);
      const length = 4 + (Math.sin(i * .73 + time * 1.6) ** 2) * envelope * (h - 10) * (.7 + pointerAmount * .3);
      context.beginPath(); context.moveTo(x, (h - length) / 2); context.lineTo(x, (h + length) / 2); context.stroke();
    }
  } else if (channelIndex === 1) {
    const words = ["你好", "Hello", "Hola"];
    context.font = "12px Georgia, serif";
    words.forEach((word, i) => {
      const x = w * (i + .5) / 3;
      const y = h / 2 + Math.sin(time + i * 1.8) * 6;
      context.textAlign = "center"; context.fillText(word, x, y);
      context.beginPath(); context.arc(x, h - 5, 1.5, 0, Math.PI * 2); context.fill();
    });
  } else if (channelIndex === 2) {
    context.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = h / 2 + Math.sin(x / w * Math.PI * 2) * h * .22;
      x ? context.lineTo(x, y) : context.moveTo(x, y);
    }
    context.stroke();
    const x = (time * 25) % w;
    context.beginPath(); context.arc(x, h / 2 + Math.sin(x / w * Math.PI * 2) * h * .22, 3.5, 0, Math.PI * 2); context.fill();
  } else {
    for (let i = 0; i < 3; i++) {
      const x = w * (i + .5) / 3;
      const phase = (time * 1.3 + i * .8) % Math.PI;
      const y = h - 7 - Math.abs(Math.sin(phase)) * (h - 18);
      context.beginPath(); context.ellipse(x, h - 4, 9 - Math.abs(Math.sin(phase)) * 4, 1, 0, 0, Math.PI * 2); context.stroke();
      context.beginPath(); context.arc(x, y, 3, 0, Math.PI * 2); context.fill();
    }
  }
}

function startDrawing() {
  if (frame !== null || motionPaused || !canvasVisible || document.hidden) return;
  const tick = (time) => {
    frame = null;
    drawFrequency(time);
    if (!motionPaused && canvasVisible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

new ResizeObserver(sizeCanvas).observe(canvas);
new IntersectionObserver(([entry]) => {
  canvasVisible = entry.isIntersecting;
  startDrawing();
}).observe(canvas);
document.addEventListener("visibilitychange", startDrawing);
canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointerAmount = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
});
$("#motion-toggle").addEventListener("click", () => { motionPaused = !motionPaused; updateMotion(); drawFrequency(performance.now()); });
motionQuery.addEventListener("change", (event) => { motionPaused = event.matches; updateMotion(); drawFrequency(performance.now()); });
$("#next-frequency").addEventListener("click", () => activateChannel(channelIndex + 1));
$$("[data-channel]").forEach((button, i) => button.addEventListener("click", () => activateChannel(i)));
keyboardTabs("[data-channel]", activateChannel);

const languageContent = [
  { id: "zh", greeting: "你好。", line: "很高兴，在这里遇见你。", status: "普通话 / 我的表达起点", lang: "zh-CN" },
  { id: "en", greeting: "Hello.", line: "A little more curious, every day.", status: "ENGLISH / 在生活里持续练习", lang: "en" },
  { id: "es", greeting: "Hola.", line: "Un paso más, cada día.", status: "ESPAÑOL / 每天，向前一步", lang: "es" },
];
function activateLanguage(index) {
  const language = languageContent[index];
  setText("#language-greeting", language.greeting);
  setText("#language-line", language.line);
  setText("#language-status", language.status);
  $("#language-greeting").lang = language.lang;
  $("#language-line").lang = language.lang;
  $("#language-panel").setAttribute("aria-labelledby", `lang-${language.id}`);
  $$("[data-lang]").forEach((tab, i) => { tab.setAttribute("aria-selected", String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
}
$$("[data-lang]").forEach((button, i) => button.addEventListener("click", () => activateLanguage(i)));
keyboardTabs("[data-lang]", activateLanguage);

function renderEntry(index) {
  entryIndex = (index + entries.length) % entries.length;
  const entry = entries[entryIndex];
  setText("#dialog-date", entry.date);
  setText("#dialog-title", entry.title);
  const body = $("#dialog-body");
  body.replaceChildren();
  if (entry.quote) { const quote = document.createElement("blockquote"); quote.textContent = entry.quote; body.append(quote); }
  entry.paragraphs.forEach((text) => { const p = document.createElement("p"); p.textContent = text; body.append(p); });
  setText("#dialog-source", entry.source);
  setText("#entry-position", `0${entryIndex + 1} / 0${entries.length}`);
  $("#journal-dialog").scrollTop = 0;
}

function openDialog(dialog) { dialog.showModal(); document.body.style.overflow = "hidden"; }
$$("[data-entry]").forEach((button) => button.addEventListener("click", () => { renderEntry(Number(button.dataset.entry)); openDialog($("#journal-dialog")); }));
$("#entry-prev").addEventListener("click", () => renderEntry(entryIndex - 1));
$("#entry-next").addEventListener("click", () => renderEntry(entryIndex + 1));

function renderPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const photo = photos[photoIndex];
  $("#lightbox-image").src = `assets/${photo.file}`;
  $("#lightbox-image").alt = photo.alt;
  setText("#lightbox-caption", photo.caption);
  setText("#photo-position", `0${photoIndex + 1} / 0${photos.length}`);
}
$$("[data-photo]").forEach((button) => button.addEventListener("click", () => { renderPhoto(Number(button.dataset.photo)); openDialog($("#photo-dialog")); }));
$("#photo-prev").addEventListener("click", () => renderPhoto(photoIndex - 1));
$("#photo-next").addEventListener("click", () => renderPhoto(photoIndex + 1));
$$("dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { document.body.style.overflow = ""; });
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    if (dialog.id === "journal-dialog") renderEntry(entryIndex + delta);
    else renderPhoto(photoIndex + delta);
  });
});
$("#journal-dialog").setAttribute("aria-labelledby", "dialog-title");
$("#photo-dialog").setAttribute("aria-label", "个人相册大图");

function shiftGallery(direction) {
  const gallery = $("#gallery");
  gallery.scrollBy({ left: direction * gallery.clientWidth * .72, behavior: motionPaused ? "instant" : "smooth" });
}
$("#gallery-prev").addEventListener("click", () => shiftGallery(-1));
$("#gallery-next").addEventListener("click", () => shiftGallery(1));

const films = [
  { id: "pulp", line: "STORIES, OUT OF ORDER.", caption: "非线性叙事 / 交错的片段" },
  { id: "wolf", line: "THE WIND REMEMBERS.", caption: "草原与风 / 旷野的呼吸" },
  { id: "shoes", line: "SMALL STEPS. A WHOLE WORLD.", caption: "脚步与涟漪 / 小小的坚持" },
];
function activateFilm(index) {
  const film = films[index];
  $("#film-panel").dataset.film = film.id;
  $("#film-panel").setAttribute("aria-labelledby", `film-${film.id}`);
  setText("#screen-label", film.line);
  setText("#film-caption", film.caption);
  $$("[data-film][role='tab']").forEach((tab, i) => { tab.setAttribute("aria-selected", String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
}
$$("[data-film][role='tab']").forEach((button, i) => button.addEventListener("click", () => activateFilm(i)));
keyboardTabs("[data-film][role='tab']", activateFilm, true);
updateMotion();
