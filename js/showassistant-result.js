
if (body.classList[4] === "showassistant-result") {




    // 將網址資訊切割，獲得展演id & 經度 & 緯度  & 使用者選擇日期  資訊
    // 用正規表達式切割  =  &  符號處
    let split = location.href.split(/[=&]+/gm)

    //(*1 將字串轉為數字)
    // ID 
    showassistant_showId = split[1] * 1
    // 經度 
    coordinate.lat = split[3] * 1
    // 緯度 
    coordinate.lng = split[5] * 1
    // 日期
    chooseDate = split[7];
    // Call weatherAPI日期
    startTime = split[7].replace(/[/]+/gm, "-");



    // 使用者選定的日期轉換
    let dateTime = new Date(split[7]);
    // 今天的日期轉換
    let current = new Date(today);
    // 即將結束 - 今天日期 = 取得差距毫秒
    let gapTime = dateTime.getTime() - current.getTime();
    // 毫秒轉換為天數
    weatherDayLimit = ((((gapTime / 1000) / 60) / 60) / 24) + 1;


    showassistant_resultShowInfo()

    showassistant_result.addEventListener("click", e => {
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
            data = response.data;


            if (weatherDayLimit <= 7) {
                weather()
            } else {
                renderShowAssistant_resultShowInfo(showassistant_result, weatherBox)
            }

        }).catch(error => {
            console.log(error);
            alert("展演詳細介紹-API資訊串接出現錯誤，請檢查console")
        })
}

// 天氣預報資訊get
function weather() {

    let locationNameCode = ``;
    data[0].locationName === "松山文創園區" ? locationNameCode = "%E4%BF%A1%E7%BE%A9%E5%8D%80" : locationNameCode = "%E4%B8%AD%E6%AD%A3%E5%8D%80";

    if (chooseDate === today) {
        axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-976EAD4A-554A-4DFE-9AB2-675A11E36DC8&locationName=${locationNameCode}&elementName=&startTime=${startTime}T18%3A00%3A00`)
            .then(response => {



                locationAreaName = response.data.records.locations[0].location[0].locationName
                locationWeatherPoP = response.data.records.locations[0].location[0].weatherElement[0].time[0].elementValue[0].value
                locationWeatherT = response.data.records.locations[0].location[0].weatherElement[1].time[0].elementValue[0].value
                locationWeatherPoPIcon = ``;


                if (locationWeatherPoP === " ") {
                    locationWeatherPoP = 0
                } else if (locationWeatherPoP === "0") {
                    locationWeatherPoP = 0
                }


                if (locationWeatherPoP === 0) {
                    locationWeatherPoPIcon = "./images/sunny.png";
                } else if (locationWeatherPoP > 0 && locationWeatherPoP <= 30) {
                    locationWeatherPoPIcon = "./images/Partly Sunny.png";
                } else if (locationWeatherPoP > 30 && locationWeatherPoP <= 60) {
                    locationWeatherPoPIcon = "./images/Showers.png";
                } else if (locationWeatherPoP > 60) {
                    locationWeatherPoPIcon = "./images/Rain.png";
                }



                renderShowAssistant_resultShowInfo(showassistant_result, weatherBox)

            }).catch(error => {
                console.log(error);
            })
    } else {
        axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-976EAD4A-554A-4DFE-9AB2-675A11E36DC8&locationName=${locationNameCode}&elementName=&startTime=${startTime}T06%3A00%3A00`)
            .then(response => {


                locationAreaName = response.data.records.locations[0].location[0].locationName
                locationWeatherPoP = response.data.records.locations[0].location[0].weatherElement[0].time[0].elementValue[0].value
                locationWeatherT = response.data.records.locations[0].location[0].weatherElement[1].time[0].elementValue[0].value
                locationWeatherPoPIcon = ``;


                if (locationWeatherPoP === " ") {
                    locationWeatherPoP = 0

                } else if (locationWeatherPoP === "0") {
                    locationWeatherPoP = 0
                }


                if (locationWeatherPoP === 0) {
                    locationWeatherPoPIcon = "./images/sunny.png";
                } else if (locationWeatherPoP > 0 && locationWeatherPoP <= 30) {
                    locationWeatherPoPIcon = "./images/Partly Sunny.png";
                } else if (locationWeatherPoP > 30 && locationWeatherPoP <= 60) {
                    locationWeatherPoPIcon = "./images/Showers.png";
                } else if (locationWeatherPoP > 60) {
                    locationWeatherPoPIcon = "./images/Rain.png";
                }


                renderShowAssistant_resultShowInfo(showassistant_result, weatherBox)

            }).catch(error => {
                console.log(error);
            })
    }


}

// 按照網址數據渲染展演資訊
function renderShowAssistant_resultShowInfo(location, weatherArea) {

    let str = ``;

    let weather = ``;

    if (weatherDayLimit <= 7) {

        str = `<div class="d-flex flex-column flex-lg-row align-items-center mb-5">
                        <img src="${data[0].imgUrl}"
                            alt="展演" style="max-height: 200px;" class="me-0 me-lg-6 mb-6 mb-lg-0 rounded-3">
                        <div class="flex-grow-1">
                            <h2 class="fs--11 fs-sm-14 text-center">${data[0].title}</h2>
                        </div>
                    </div>
                    <hr>
                    <p class="fs--9 mb-5 fw-bold">您欲參加的活動位於台北市 ${locationAreaName}，詳細展覽資訊及地圖如下，當天平均溫度為 ${locationWeatherT}度，該區降雨機率為 ${locationWeatherPoP}%，資訊供您參考。</p>
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

        weather = `<div class="d-flex flex-column justify-content-evenly">
                      <h3 class=" fs--20 fs-sm-24 mb-2">台北市</h3>
                      <p class="fs--10  fs-sm-14 font-Montserrat ms-1 mb-4">${locationAreaName}</p>
                      <p class="fs--20  fs-sm-24 font-Montserrat ms-1 mb-4 fw-bold">${locationWeatherT}<span>°C</span></p>
                      <p class="fs--6 fs-sm-9 font-Montserrat ms-1 mb-4 d-flex align-items-center">降雨機率為:<span class="fs--12  fs-sm-14 ms-2 mb-2  font-Montserrat fw-bold">${locationWeatherPoP}%</span></p>
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                      <img src="${locationWeatherPoPIcon}" alt="weatherIcon" class="p-1 p-sm-3 weatherIcon">
                  </div>`
    } else {
        str = `<div class="d-flex flex-column flex-lg-row align-items-center mb-5">
                    <img src="${data[0].imgUrl}"
                        alt="展演" style="max-height: 200px;" class="me-0 me-lg-6 mb-6 mb-lg-0 rounded-3">
                    <div class="flex-grow-1">
                        <h2 class="fs--11 fs-sm-14 text-center">${data[0].title}</h2>
                    </div>
                </div>
                <hr>
                <p class="fs--9 mb-5 fw-bold">您欲參加的活動位於台北市，詳細展覽資訊及地圖如下，資訊供您參考，目天氣預報功能支援7天內的查詢，還請出發前多加利用。</p>
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

        weather = `<div class="d-flex flex-column justify-content-evenly">
                     <h3 class="text-center">目前預報僅支援7天內查詢<br/>還請出發前多加利用</h3>
                   </div>`

    }

    location.innerHTML = str;
    weatherArea.innerHTML = weather;
    gsap.to(".weatherIcon", { y: -15, duration: 4, repeat: -1 })

}

