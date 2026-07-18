// ==================================
// NikkeiNewsPWA Ver.3
// PDF Reader 抽出確認版
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

        let pageResult = "";



        for(
            let i = 1;
            i <= pdf.numPages;
            i++
        ){


            const page =

            await pdf.getPage(i);



            const content =

            await page.getTextContent();



            const pageText =

            content.items

            .map(
                item=>item.str
            )

            .join(" ");



            fullText +=

            "\n\n--- PAGE "
            + i +
            " ---\n\n"
            +
            pageText;



            pageResult +=

            `
            <h3>
            PAGE ${i}
            </h3>

            <p>
            ${pageText}
            </p>

            `;


        }



        console.log(
            "PDF抽出結果",
            fullText
        );



        let area =

        document.getElementById(
            "pdfResult"
        );



        if(!area){


            area =
            document.createElement(
                "div"
            );


            area.id =
            "pdfResult";


            area.className =
            "news-card";



            document.body
            .appendChild(
                area
            );


        }



        area.innerHTML =

        `

        <h2>
        PDF抽出結果
        </h2>

        ${pageResult}

        `;



        alert(

        "PDF抽出完了\nページ数："
        +
        pdf.numPages

        );



    };



    reader.readAsArrayBuffer(
        file
    );


}