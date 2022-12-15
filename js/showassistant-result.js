if (body.classList[4] === "showassistant-result") {




    // 將網址資訊切割，獲得展演id & 經度 & 緯度   資訊

    // 用正規表達式切割  =  &  符號處
    let split = location.href.split(/[=&]+/gm)

    // ID (*1 將字串轉為數字)
    showassistant_showId = split[1] * 1
    // 經度 (*1 將字串轉為數字)
    coordinate.lat = split[3] * 1
    // 緯度 (*1 將字串轉為數字)
    coordinate.lng = split[5] * 1


    showassistant_resultShowInfo()

    showassistant_result.addEventListener("click",e=>{
        showId = e.target.getAttribute("data-show-id");
        if (e.target.textContent === "加入收藏清單") {
            e.preventDefault();

            // 收藏活動前，判斷使用者是否已加入會員 & 收藏活動
            memberOrNot()
        }
    })

    // 按照查詢結果送出所獲取的經緯度資訊，渲染本頁Google地圖
    // Initialize and add the map
    function initMap() {
        // The location of Uluru
        const mapLocation = coordinate;
        // The map, centered at Uluru
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: mapLocation,
        });
        // The marker, positioned at Uluru
        const marker = new google.maps.Marker({
            position: mapLocation,
            map: map,
        });
    }

    window.initMap = initMap;

}

// get 展演清單  
function showassistant_resultShowInfo() {

    axios.get(`http${secure}://${api_domain}/shows?id=${showassistant_showId}`)
        .then(response => {
            console.log(response)
            data = response.data;

            renderShowAssistant_resultShowInfo()

        }).catch(error => {
            console.log(error);
            alert("展演詳細介紹-API資訊串接出現錯誤，請檢查console")
        })
}

// 按照網址數據渲染展演資訊
function renderShowAssistant_resultShowInfo() {

    let str = `<div class="d-flex flex-column flex-lg-row align-items-center mb-5">
                        <img src="${data[0].imgUrl}"
                            alt="展演" style="max-height: 200px;" class="me-0 me-lg-6 mb-6 mb-lg-0 rounded-3">
                        <div class="flex-grow-1">
                            <h2 class="fs--11 fs-sm-14 text-center">${data[0].title}</h2>
                        </div>
                    </div>
                    <hr>
                    <p class="fs--9 mb-5 fw-bold">前往活動的日期仍在展期內，歡迎前往參觀，當日天氣為雨天，
                        降雨機率80%，資訊供您參考。</p>
                    <div class="d-lg-flex justify-content-between mb-6">
                        <ul>
                            <li class="mb-1">
                                <strong class="me-2">展出地點 :</strong> <span
                                    class="font-Montserrat fs--7 fs-sm-8">${data[0].location}</span>
                            </li>
                            <li class="mb-1">
                                <strong class="me-2">票價 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${data[0].price}</span>
                            </li>
                            <li class="mb-1">
                                <strong class="me-2">展出日期 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${data[0].startDate} –
                                    ${data[0].endDate}</span>
                            </li>
                            <li>
                                <strong class="me-2">展出時段 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${data[0].startTime}  -
                                    ${data[0].endTime}
                                    </span>
                            </li>
                        </ul>
                        <div class="d-flex justify-content-center align-items-end">
                            <button type="button"
                                class="btn btn-outline-dark d-none d-lg-block">加入收藏清單</button>
                        </div>
                    </div>`


    showassistant_result.innerHTML = str;
}