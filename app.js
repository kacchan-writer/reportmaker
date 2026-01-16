const abstractInput = document.getElementById("abstract");
const generateButton = document.getElementById("generate");
const clearButton = document.getElementById("clear");
const copyButton = document.getElementById("copy");
const downloadButton = document.getElementById("download");
const reportOutput = document.getElementById("report");
const hint = document.getElementById("hint");

const defaultSections = [
  "背景",
  "目的",
  "方法",
  "結果",
  "考察",
  "結論",
];

const sentenceSplitRegex = /(?<=[。！？])\s*/g;

const buildReport = (abstractText) => {
  const trimmed = abstractText.trim();
  const sentences = trimmed
    ? trimmed.split(sentenceSplitRegex).filter(Boolean)
    : [];

  const pickSentence = (index, fallback) => {
    if (sentences[index]) {
      return sentences[index].trim();
    }
    return fallback;
  };

  const sections = {
    背景: pickSentence(0, "課題の背景と現状の問題点を整理する。"),
    目的: pickSentence(1, "本レポートでは要旨の内容を基に目的を明確化する。"),
    方法: pickSentence(
      2,
      "調査・実験・分析の手順を整理し、要旨に記載されたアプローチを説明する。"
    ),
    結果: pickSentence(3, "得られた知見や主要な結果を要約する。"),
    考察: pickSentence(
      4,
      "結果の意味を検討し、要旨の内容から示唆される点を議論する。"
    ),
    結論: pickSentence(5, "研究のまとめと今後の展望を簡潔に述べる。"),
  };

  const reportLines = [
    "# レポート",
    "",
    `## 要旨\n${trimmed}`,
    "",
    ...defaultSections.flatMap((section) => [
      `## ${section}`,
      sections[section],
      "",
    ]),
  ];

  return reportLines.join("\n").trim();
};

const updateActions = (hasReport) => {
  copyButton.disabled = !hasReport;
  downloadButton.disabled = !hasReport;
};

const generateReport = () => {
  const abstractText = abstractInput.value;
  if (!abstractText.trim()) {
    reportOutput.textContent = "";
    hint.textContent = "要旨を入力してください。";
    updateActions(false);
    return;
  }

  const report = buildReport(abstractText);
  reportOutput.textContent = report;
  hint.textContent = "生成された内容を編集・追記して完成させてください。";
  updateActions(true);
};

const clearForm = () => {
  abstractInput.value = "";
  reportOutput.textContent = "";
  hint.textContent = "要旨を入力して「レポートを生成」を押してください。";
  updateActions(false);
};

const copyReport = async () => {
  const report = reportOutput.textContent;
  if (!report) {
    return;
  }

  try {
    await navigator.clipboard.writeText(report);
    copyButton.textContent = "コピーしました";
    setTimeout(() => {
      copyButton.textContent = "コピー";
    }, 2000);
  } catch (error) {
    copyButton.textContent = "コピー失敗";
    setTimeout(() => {
      copyButton.textContent = "コピー";
    }, 2000);
  }
};

const downloadReport = () => {
  const report = reportOutput.textContent;
  if (!report) {
    return;
  }

  const blob = new Blob([report], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "report.md";
  link.click();
  URL.revokeObjectURL(link.href);
};

generateButton.addEventListener("click", generateReport);
clearButton.addEventListener("click", clearForm);
copyButton.addEventListener("click", copyReport);
downloadButton.addEventListener("click", downloadReport);
