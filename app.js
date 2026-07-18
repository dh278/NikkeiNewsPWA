// ==================================
// NikkeiNewsPWA Ver.3
// app.js
// 日付切替対応版
// ==================================


let newsData = [];

let currentDate =
    new Date()
    .toISOString()
    .slice(0,10);



// ===============================
// ニュース読み込み
// ===============================

async function loadNews(){


    try{


        const response =

        await fetch(
            "data/" + currentDate + ".json"
        );



        if(!response.ok){

            throw new Error(
                "データなし"
            );

        }



        newsData =

        await response.json();



        renderNews(newsData);


        updateDashboard(
            newsData
        );



    }catch(error){


        document
        .getElementById(
            "newsList"
        )
        .innerHTML =


        `

        <div class="news-card">

        <h3>
        ${currentDate}
        のニュースがありません
        </h3>

        <p>
        dataフォルダにJSONを追加してください。
        </p>

        </div>

        `;


        console.error(error);

    }


}





// ===============================
// ニュース表示
// ===============================

function renderNews(data){



    const list =

    document.getElementById(
        "newsList"
    );



    list.innerHTML = "";



    data.forEach(item=>{


        const favorite =

        getFavorites()
        .includes(item.id);



        const card =

        document.createElement(
            "div"
        );



        card.className =
        "news-card";



        card.innerHTML =


        `

        <h3
        onclick="openArticle(${item.id})"
        style="cursor:pointer">

        ${item.title}

        </h3>


        <p>

        ${item.summary}

        </p>



        <div class="news-meta">


        <span>
        ${item.category}
        </span>


        <span>
        ${item.date}
        </span>


        </div>



        <button
        onclick="toggleFavorite(${item.id})">

        ${favorite ? "⭐" : "☆"}

        </button>


        `;



        list.appendChild(card);


    });


}





// ===============================
// 検索・カテゴリ
// ===============================


function filterNews(){



    const keyword =

    document
    .getElementById(
        "search"
    )
    .value
    .toLowerCase();



    const category =

    document
    .getElementById(
        "category"
    )
    .value;




    const result =


    newsData.filter(item=>{


        const text =


        (

        item.title +

        item.summary +

        item.category +

        item.theme

        )
        .toLowerCase();



        const keywordOK =

        text.includes(
            keyword
        );



        const categoryOK =

        category === ""

        ||

        item.category === category;



        return

        keywordOK

        &&

        categoryOK;


    });



    renderNews(result);


}





// ===============================
// お気に入り
// ===============================


function getFavorites(){


    return JSON.parse(

        localStorage.getItem(
            "favorites"
        )

    ) || [];


}




function toggleFavorite(id){



    let favorites =

    getFavorites();



    if(
        favorites.includes(id)
    ){


        favorites =

        favorites.filter(
            x=>x!==id
        );



    }else{


        favorites.push(id);


    }



    localStorage.setItem(

        "favorites",

        JSON.stringify(
            favorites
        )

    );



    renderNews(
        newsData
    );


}




// ===============================
// 記事詳細
// ===============================


function openArticle(id){


    location.href =

    "article.html?id=" + id;


}





// ===============================
// ダッシュボード
// ===============================


function updateDashboard(data){



    document
    .getElementById(
        "count"
    )
    .textContent =

    data.length;



    document
    .getElementById(
        "date"
    )
    .textContent =

    currentDate;




    const categories = {};



    data.forEach(item=>{


        categories[item.category] =


        (categories[item.category] || 0)

        +1;


    });




    const top =


    Object.entries(categories)

    .sort(
        (a,b)=>b[1]-a[1]
    )[0];



    document
    .getElementById(
        "theme"
    )
    .textContent =


    top

    ?

    top[0]

    :

    "---";


}





// ===============================
// ダークモード
// ===============================


function setupDarkMode(){



    const button =

    document
    .getElementById(
        "darkMode"
    );



    if(
        localStorage.getItem(
            "darkMode"
        )
        ===
        "on"
    ){

        document.body
        .classList
        .add(
            "dark"
        );

    }



    button.onclick = ()=>{


        document.body
        .classList
        .toggle(
            "dark"
        );



        localStorage.setItem(

            "darkMode",

            document.body
            .classList
            .contains(
                "dark"
            )

            ?

            "on"

            :

            "off"

        );


    };


}





// ===============================
// 起動
// ===============================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadNews();



    setupDarkMode();




    document
    .getElementById(
        "dateSelect"
    )
    .value =

    currentDate;




    document
    .getElementById(
        "dateSelect"
    )
    .addEventListener(

    "change",

    e=>{


        currentDate =

        e.target.value;



        loadNews();


    });



    document
    .getElementById(
        "search"
    )
    .addEventListener(

    "input",

    filterNews

    );




    document
    .getElementById(
        "category"
    )
    .addEventListener(

    "change",

    filterNews

    );



});