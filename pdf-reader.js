// ==================================
// NikkeiNewsPWA Ver.3
// PDF Reader
// 日経PDFクリーニング対応版
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



let pageText =

content.items

.map(
item=>item.str
)

.join(" ");



pageText =
cleanText(pageText);



fullText +=

"\n"
+
pageText;



}




console.log(
"クリーニング後本文",
fullText
);




createArticle(fullText);



};



reader.readAsArrayBuffer(
file
);


}






// ==============================
// 不要文字削除
// ==============================

function cleanText(text){



return text



// URL削除

.replace(
/https?:\/\/\S+/g,
""
)



// 日付削除

.replace(
/\d{4}\/\d{1,2}\/\d{1,2}/g,
""
)



// PDF番号削除

.replace(
/\d+\s*PDF/g,
""
)



// ページ番号系削除

.replace(
/^\s*\d+\s*$/gm,
""
)



// 空白整理

.replace(
/\s+/g,
" "
)



.trim();



}







// ==============================
// 記事作成
// ==============================

function createArticle(text){



const article = {


id:
Date.now(),



title:

text.substring(
0,
60
),



summary:

text.substring(
0,
200
)
+
"…",



category:

detectCategory(text),



theme:

detectTheme(text),



company:

detectCompany(text),



date:

new Date()
.toISOString()
.slice(0,10),



importance:

"中"


};




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



}







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
text.includes("銀行")
||
text.includes("金利")
){

return "金融";

}


return "その他";


}





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





function detectCompany(text){


const list = [

"トヨタ",
"ソニー",
"キオクシア",
"日立",
"三菱",
"サムスン"

];



for(
const company of list
){


if(
text.includes(company)
){

return company;

}


}



return "未分類";


}