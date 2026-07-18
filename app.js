// ===============================
// NikkeiNewsPWA Ver.3
// Application Script
// ===============================


let newsData = [];


// JSON読み込み
async function loadNews(){

    try{

        const today =
        new Date()
        .toISOString()
        .slice(0,10);


        const response =
        await fetch(
            `data/${today}.json`
        );


        newsData =
        await response.json();


        renderNews(newsData);


        updateDashboard(newsData);


    }catch(error){

        document.getElementById(
            "newsList"
        ).innerHTML =
        `
        <div class="news-card">
        <h3>ニュースデータがありません</h3>
        <p>
        dataフォルダにJSONファイルを配置してください。
        </p>
        </div>
        `;

        console.error(error);

    }

}



// 記事表示

function renderNews(data){


    const list =
    document.getElementById(
        "newsList"
    );


    list.innerHTML="";


    data.forEach(
        (item,index)=>{


        const favorite =
        getFavorites()
        .includes(index);


        const card =
        document.createElement(
            "div"
        );


        card.className =
        "news-card";


        card.innerHTML =

        `
        <h3>
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
        onclick="toggleFavorite(${index})">

        ${favorite ? "⭐" : "☆"}

        </button>

        `;


        list.appendChild(card);


    });


}




// 検索・カテゴリ処理

function filterNews(){


    const keyword =
    document
    .getElementById("search")
    .value
    .toLowerCase();


    const category =
    document
    .getElementById("category")
    .value;



    const result =
    newsData.filter(item=>{


        const text =

        (
        item.title+
        item.summary+
        item.category
        )
        .toLowerCase();



        const matchKeyword =
        text.includes(keyword);



        const matchCategory =
        category === ""
        ||
        item.category === category;



        return (
            matchKeyword
            &&
            matchCategory
        );

    });



    renderNews(result);


}



// お気に入り

function getFavorites(){

    return JSON.parse(

        localStorage
        .getItem(
            "favorites"
        )

    ) || [];

}



function toggleFavorite(index){


    let favorites =
    getFavorites();



    if(
        favorites.includes(index)
    ){

        favorites =
        favorites.filter(
            x=>x!==index
        );


    }else{


        favorites.push(index);

    }



    localStorage.setItem(

        "favorites",

        JSON.stringify(
            favorites
        )

    );


    renderNews(newsData);

}



// ダッシュボード

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
    data[0]?.date || "---";



    const categories = {};


    data.forEach(item=>{

        categories[item.category]
        =
        (categories[item.category]||0)+1;

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



// ダークモード

function setupDarkMode(){


    const button =
    document.getElementById(
        "darkMode"
    );



    const saved =
    localStorage
    .getItem(
        "darkMode"
    );



    if(saved==="on"){

        document.body
        .classList
        .add("dark");

    }



    button.onclick =
    ()=>{


        document.body
        .classList
        .toggle(
            "dark"
        );


        localStorage
        .setItem(

            "darkMode",

            document.body
            .classList
            .contains("dark")
            ?
            "on"
            :
            "off"

        );

    };


}



// 起動

document.addEventListener(

"DOMContentLoaded",

()=>{


    loadNews();


    setupDarkMode();



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