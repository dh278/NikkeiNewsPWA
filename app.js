fetch('data/2026-07-17.json').then(r=>r.json()).then(d=>{const l=document.getElementById('list');const q=document.getElementById('q');function render(f=''){l.innerHTML='';d.filter(x=>x.title.includes(f)||x.summary.includes(f)).forEach(x=>{let li=document.createElement('li');li.innerHTML='<b>'+x.title+'</b><br>'+x.summary;l.appendChild(li);});}q.oninput=()=>render(q.value);render();});if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');
// ================================

// 新聞ダッシュボード Ver.2

// app.js

// ================================

// 今日の日付を表示

const today = document.getElementById("today");

if (today) {

    const now = new Date();

    const dateString =

        now.getFullYear() + "年" +

        (now.getMonth() + 1) + "月" +

        now.getDate() + "日";

    today.textContent = dateString;

}

// メニューボタン

const buttons = document.querySelectorAll(".menu button");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        console.log(button.textContent + " を選択");

    });

});

// Service Worker登録（PWA）

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker

            .register("./sw.js")

            .then(() => {

                console.log("Service Worker登録成功");

            })

            .catch(err => {

                console.log("登録失敗", err);

            });

    });

}

// 今後追加予定

// ・PDF読込

// ・AI要約

// ・重要度ランキング

// ・企業抽出

// ・営業リスト生成

// ・検索機能

// ・お気に入り保存

// ・ダークモード
const pdfFile = document.getElementById("pdfFile");

const analyzeBtn = document.getElementById("analyzeBtn");

const status = document.getElementById("status");

if (pdfFile && analyzeBtn && status) {

    analyzeBtn.addEventListener("click", () => {

        if (!pdfFile.files.length) {

            status.textContent = "PDFを選択してください";

            return;

        }

        const file = pdfFile.files[0];

        status.textContent =

            "選択中：" + file.name +

            "（解析機能は次の段階で追加します）";

    });

}
// ===============================
// PDF読み込み
// ===============================

async function readPDF(file){

    const reader = new FileReader();

    reader.onload = async function(){

        const typedArray = new Uint8Array(reader.result);

        const pdf = await pdfjsLib.getDocument({
            data: typedArray
        }).promise;

        let text = "";

        for(let page=1; page<=pdf.numPages; page++){

            const p = await pdf.getPage(page);

            const content = await p.getTextContent();

            text += content.items
                .map(item => item.str)
                .join(" ");

            text += "\n\n";
        }

        console.log(text);

        document.getElementById("status").textContent =
            "PDF読込完了（" + pdf.numPages + "ページ）";

        // 次の段階でAI分析を実行
        analyzeText(text);

    };

    reader.readAsArrayBuffer(file);

}

function analyzeText(text){

    const newsList = document.getElementById("newsList");

    newsList.innerHTML = "";

    const card = document.createElement("article");

    card.className = "card importance-high";

    card.innerHTML = `
        <h2>PDF解析結果</h2>
        <p>${text.substring(0,800)}...</p>
    `;

    newsList.appendChild(card);

}

analyzeBtn.addEventListener("click",()=>{

    if(!pdfFile.files.length){

        alert("PDFを選択してください");

        return;

    }

    readPDF(pdfFile.files[0]);

});