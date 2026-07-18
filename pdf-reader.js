// ==================================
// NikkeiNewsPWA Ver.3
// PDF Reader
// PDF読み込み基盤
// ==================================


// PDFファイル選択

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

    function(e){


        const file =
        e.target.files[0];



        if(!file){

            return;

        }



        readPDF(file);



    });



});




// PDF読み込み

async function readPDF(file){



    const reader =
    new FileReader();



    reader.onload = async function(){



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



        let text = "";



        for(
            let i = 1;
            i <= pdf.numPages;
            i++
        ){



            const page =

            await pdf
            .getPage(i);



            const content =

            await page
            .getTextContent();



            const pageText =

            content.items

            .map(
                item =>
                item.str
            )

            .join(" ");



            text +=

            "\n" +

            pageText;



        }



        console.log(
            "PDF本文",
            text
        );



        alert(
            "PDF読み込み完了\nページ数：" +
            pdf.numPages
        );



    };



    reader.readAsArrayBuffer(
        file
    );


}