// ==================================
// NikkeiNewsPWA Ver.3
// PDF Reader 強化版
// ==================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const pdfFile =
document.getElementById(
"pdfFile"
);



if(!pdfFile){

return;

}



pdfFile.addEventListener(
"change",
e=>{


const file =
e.target.files[0];


if(file){

readPDF(file);

}


});


});





async function readPDF(file){


const reader =
new FileReader();



reader.onload =
async function(){



const typedarray =
new Uint8Array(
this.result
);



const pdf =

await pdfjsLib
.getDocument(
typedarray
)
.promise;



let fullText = "";



for(
let i=1;
i<=pdf.numPages;
i++
){


const page =
await pdf.getPage(i);



const content =
await page.getTextContent();



const text =

content.items

.map(
item=>item.str
)

.join(" ");



fullText += text + "\n";


}




// 記事データ作成

const article = {


id:
Date.now(),


title:
extractTitle(
fullText
),


summary:
createSummary(
fullText
),


category:
detectCategory(
fullText
),


theme:
detectTheme(
fullText
),


company:
detectCompany(
fullText
),


date:
new Date()
.toISOString()
.slice(0,10),


importance:
"中"


};




// アプリ表示用に追加

newsData.unshift(
article
);


renderNews(
newsData
);


updateDashboard(
newsData
);



alert(
"PDF記事を追加しました"
);



};


reader.readAsArrayBuffer(
file
);


}




// タイトル抽出

function extractTitle(text){


return text

.split("\n")

[0]

.substring(
0,
80
)

||
"PDFニュース";


}




// 要約

function createSummary(text){


return text

.replace(/\s+/g," ")

.substring(
0,
150
)

+
"…";


}





// カテゴリ判定

function detectCategory(text){


if(
text.includes("半導体")
||
text.includes("AI")
){

return "半導体";

}


if(
text.includes("物流")
){

return "物流";

}


if(
text.includes("金融")
||
text.includes("銀行")
){

return "金融";

}


return "その他";


}





// テーマ判定

function detectTheme(text){


if(
text.includes("AI")
){

return "AI";

}


if(
text.includes("投資")
){

return "設備投資";

}


return "ニュース";


}




// 企業名簡易抽出

function detectCompany(text){


const companies = [

"トヨタ",

"ソニー",

"キオクシア",

"日立",

"三菱",

"サムスン"

];



for(
const c of companies
){

if(
text.includes(c)
){

return c;

}

}



return "未分類";


}