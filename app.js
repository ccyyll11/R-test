const lessons = [
  {
    title: "认识 R", label: "为什么选择 R？", lead: "先认识 R 的工作方式与它擅长解决的问题，完成你的第一行代码。",
    concept: "R 是一门专为数据分析与统计计算设计的语言。把指令写入控制台，R 会立即计算并返回结果。",
    code: '# 我的第一行 R 代码\nprint("Hello, R!")\n\n# R 也可以直接当计算器\n(18 + 24) / 6',
    output: '[1] "Hello, R!"\n[1] 7',
    task: "输出数字 42", starter: "# 在这里输入代码\nprint()", answer: /print\s*\(\s*42\s*\)/
  },
  {
    title: "变量与赋值", label: "给数据起个名字", lead: "学习如何保存数据、给它命名，并在后续分析中反复使用。",
    concept: "变量就像贴了标签的盒子。R 通常使用赋值符号 < 来创建变量，准确写法是 <code class='inline-code'>&lt;-</code>。一个清晰的名字会让代码更容易理解。",
    code: '# 创建两个变量\nprice <- 28\nquantity <- 3\n\n# 使用变量进行计算\ntotal <- price * quantity\nprint(total)',
    output: '[1] 84',
    task: "创建变量 score 并赋值为 100", starter: "# 完成下面的代码\nscore <- ", answer: /score\s*<-\s*100/
  },
  {
    title: "向量", label: "一次处理一组数据", lead: "使用向量保存一系列值，并体验 R 强大的向量化计算。",
    concept: "向量是 R 最基础的数据结构。函数 <code class='inline-code'>c()</code> 可以把多个值组合在一起，而运算会自动作用于其中每个元素。",
    code: 'scores <- c(82, 91, 76, 95)\n\n# 计算平均值\nmean(scores)\n\n# 每个分数都加 5\nscores + 5',
    output: '[1] 86\n[1] 87 96 81 100',
    task: "创建包含 2、4、6 的向量 nums", starter: "nums <- c()", answer: /nums\s*<-\s*c\s*\(\s*2\s*,\s*4\s*,\s*6\s*\)/
  },
  {
    title: "数据框", label: "组织表格数据", lead: "将不同类型的数据组合成表格，开始像数据分析师一样思考。",
    concept: "数据框类似电子表格：每一列是一个变量，每一行是一条观测。使用 <code class='inline-code'>data.frame()</code> 即可创建。",
    code: 'students <- data.frame(\n  name = c("小林", "阿杰"),\n  score = c(88, 93)\n)\n\nprint(students)',
    output: '  name score\n1 小林    88\n2 阿杰    93',
    task: "用 data.frame() 创建变量 df", starter: "df <- ", answer: /df\s*<-\s*data\.frame\s*\(/
  },
  {
    title: "条件判断", label: "让代码做出选择", lead: "使用 if / else 根据不同条件执行不同的代码。",
    concept: "条件判断让程序拥有分支能力。当括号中的表达式为 TRUE 时执行第一段代码，否则执行 else 后的代码。",
    code: 'score <- 86\n\nif (score >= 60) {\n  print("通过")\n} else {\n  print("继续加油")\n}',
    output: '[1] "通过"',
    task: "写出判断 x 大于 10 的 if 条件", starter: "if () {\n  print(\"很大\")\n}", answer: /if\s*\(\s*x\s*>\s*10\s*\)/
  }
];

let activeLesson = Number(localStorage.getItem("r-lab-active")) || 1;
let completed = JSON.parse(localStorage.getItem("r-lab-completed") || "[0]");
const lessonList = document.querySelector("#lessonList");
const content = document.querySelector("#lessonContent");

function renderNav() {
  lessonList.innerHTML = lessons.map((lesson, i) => `
    <button class="lesson-nav-item ${i === activeLesson ? "active" : ""} ${completed.includes(i) ? "done" : ""}" data-index="${i}">
      <span class="lesson-number">${String(i + 1).padStart(2, "0")}</span>
      <span>${lesson.title}</span><span class="status-dot">${completed.includes(i) ? "✓" : "·"}</span>
    </button>`).join("");
  lessonList.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => selectLesson(Number(btn.dataset.index))));
  const pct = Math.round(completed.length / lessons.length * 100);
  document.querySelector("#progressText").textContent = `${pct}%`;
  document.querySelector("#progressFill").style.width = `${pct}%`;
  document.querySelector("#progressDetail").textContent = `已完成 ${completed.length} / ${lessons.length} 节`;
}

function renderLesson() {
  const l = lessons[activeLesson];
  document.querySelector("#crumbTitle").textContent = l.title;
  content.innerHTML = `
    <p class="eyebrow">LESSON ${String(activeLesson + 1).padStart(2, "0")} · 基础入门</p>
    <h1>${l.label}</h1>
    <p class="lesson-lead">${l.lead}</p>
    <div class="objective-row">
      <div class="objective"><span class="objective-icon">⌁</span><p><strong>本节目标</strong>理解 ${l.title} 的核心概念</p></div>
      <div class="objective"><span class="objective-icon">◫</span><p><strong>预计用时</strong>大约 8 分钟</p></div>
      <div class="objective"><span class="objective-icon">＋</span><p><strong>完成奖励</strong>获得 20 XP</p></div>
    </div>
    <div class="section-title"><span>1</span><h2>概念速览</h2></div>
    <p class="explain">${l.concept}</p>
    ${codeCard(l.code, "示例代码", "demo")}
    <div class="callout"><span>💡</span><p><strong>试一试：</strong>代码可以直接修改。改动数字或文字，再点击“运行代码”，观察输出如何变化。</p></div>
    <div class="exercise-card">
      <div class="exercise-top"><span class="exercise-badge">动手练习</span><span class="xp">+20 XP</span></div>
      <h3>${l.task}</h3><p>补全代码，然后运行并检查答案。</p>
      ${codeCard(l.starter, "你的答案", "exercise")}
      <p class="exercise-feedback" id="exerciseFeedback"></p>
    </div>
    <footer class="lesson-footer">
      <button class="complete-button ${completed.includes(activeLesson) ? "done" : ""}" id="completeButton">${completed.includes(activeLesson) ? "✓ 已完成本节" : "标记为已完成"}</button>
      <button class="next-button" id="nextButton" ${activeLesson === lessons.length - 1 ? "disabled" : ""}>下一节 →</button>
    </footer>`;
  bindLessonEvents();
}

function codeCard(code, label, type) {
  return `<div class="code-card" data-type="${type}">
    <div class="code-head"><div class="window-dots"><i></i><i></i><i></i></div><span class="code-label">${label} · R</span></div>
    <div class="editor-wrap"><textarea class="code-editor" spellcheck="false" aria-label="${label}">${code}</textarea></div>
    <div class="code-actions"><button class="reset-button">↻ 重置</button><button class="run-button">▶ 运行代码</button></div>
    <div class="console"></div>
  </div>`;
}

function bindLessonEvents() {
  document.querySelectorAll(".code-card").forEach(card => {
    const original = card.querySelector("textarea").value;
    card.querySelector(".run-button").addEventListener("click", () => runCode(card));
    card.querySelector(".reset-button").addEventListener("click", () => {
      card.querySelector("textarea").value = original;
      card.querySelector(".console").classList.remove("show");
    });
    card.querySelector("textarea").addEventListener("keydown", e => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runCode(card); }
    });
  });
  document.querySelector("#completeButton").addEventListener("click", toggleComplete);
  document.querySelector("#nextButton").addEventListener("click", () => selectLesson(activeLesson + 1));
}

function runCode(card) {
  const code = card.querySelector("textarea").value;
  const consoleEl = card.querySelector(".console");
  const isExercise = card.dataset.type === "exercise";
  if (isExercise) {
    const ok = lessons[activeLesson].answer.test(code);
    consoleEl.textContent = ok ? "✓ 代码运行成功！" : "! 代码可以运行，但结果还不符合题目要求。";
    const feedback = document.querySelector("#exerciseFeedback");
    feedback.className = `exercise-feedback ${ok ? "success" : "error"}`;
    feedback.textContent = ok ? "做得漂亮！你已经掌握了这个知识点。" : "再检查一下变量名、符号和数值是否与题目一致。";
  } else {
    consoleEl.textContent = `> 运行结果\n${simulateOutput(code)}`;
  }
  consoleEl.classList.add("show");
}

function simulateOutput(code) {
  if (code.includes('Hello, R!')) return lessons[0].output;
  if (/price\s*<-\s*28/.test(code)) return lessons[1].output;
  if (/scores\s*<-/.test(code)) return lessons[2].output;
  if (/students\s*<-/.test(code)) return lessons[3].output;
  if (/score\s*<-\s*86/.test(code)) return lessons[4].output;
  const printNumber = code.match(/print\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)/);
  if (printNumber) return `[1] ${printNumber[1]}`;
  return "[模拟控制台] 代码已执行。修改示例中的值，继续探索吧。";
}

function toggleComplete() {
  if (completed.includes(activeLesson)) completed = completed.filter(i => i !== activeLesson);
  else { completed.push(activeLesson); completed.sort(); showToast("本节完成，获得 20 XP！"); }
  localStorage.setItem("r-lab-completed", JSON.stringify(completed));
  renderNav(); renderLesson();
}

function selectLesson(index) {
  if (index < 0 || index >= lessons.length) return;
  activeLesson = index;
  localStorage.setItem("r-lab-active", String(index));
  renderNav(); renderLesson();
  document.querySelector("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message; toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

document.querySelector("#menuButton").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.addEventListener("click", e => {
  if (window.innerWidth <= 800 && !e.target.closest("#sidebar") && !e.target.closest("#menuButton")) document.querySelector("#sidebar").classList.remove("open");
});
renderNav(); renderLesson();
