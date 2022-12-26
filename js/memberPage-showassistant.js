if (body.classList[4] === "memberPage-showassistant") {


    // vanillajs-datepicker 日曆套件設定
    const elem = document.querySelector('input[name="member-date-select"]');
    const datepicker = new Datepicker(elem, {
        language: 'zh-TW', // 語系設定，要額外載入JS
        minDate: 'auto', // 最小可選日期
        autohide: true,
        clearBtn: true,
        maxDate: maxDate, // 最大可選日期，用來設定展覽結束日
        datesDisabled: [], // 單日設定不可選取的日期，陣列內每筆資料字串日期，用來設定特殊休館日
        daysOfWeekDisabled: [] // 設定每週固定不可選的日期，陣列內每筆資料數字號碼，0為星期日 1為禮拜1，依此類推，用來設定固定休館日
    });

    
    // 負責判斷使用者點選到哪種類型展覽，並做相應渲染處理
    member_location_select.addEventListener("change", e => {
        let target = e.target.value;


        member_show_select.setAttribute("value", "");
        member_show_select.value = "";

        member_date_select.setAttribute("value", "");
        member_date_select.value = "";

        if (target === "全部活動") {
            getShowInfo(member_show_select)
        } else if (target === "松山文創") {
            selectShowArea("松山文創園區")
        } else if (target === "華山文創") {
            selectShowArea("華山1914文化創意產業園區")
        } else if (target === "我的收藏") {
            selectShowArea_favorite()
        }

    })


    // 負責判斷使用者點選到哪個展覽，並做相對應日曆的渲染及防呆
    member_show_select.addEventListener("change", e => {
        let target = e.target.value;

        let targetLocation = member_location_select.value;
        let targetShow = member_show_select.value;
        let targetDate = member_date_select;



        // 當使用者選取的類別是我的收藏時
        if (targetLocation === "我的收藏") {

            // 若使用者點選A活動日期 再回來改選活動B
            if (targetShow !== "請選擇類別") {
                correct = data.filter(i => i.show.title === target)

                // 且選擇的活動日期 大於 B活動結束日期 ，將做提醒
                if (correct[0].show.endDate < targetDate.value) {
                    Swal.fire({
                        title: '您選擇的日期此活動已結束<br/>再重新選擇，謝謝',
                        scrollbarPadding: false,
                        heightAuto: false,
                        showConfirmButton: false,
                        confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
                        timer: 3000
                    })

                    // 並將日曆復位
                    maxDate = correct[0].show.endDate;
                    datesDisabled = correct[0].show.restDay;
                    daysOfWeekDisabled = correct[0].show.restDayOfWeek;

                    datepicker.setOptions({
                        maxDate: maxDate,
                        datesDisabled: datesDisabled,
                        daysOfWeekDisabled: daysOfWeekDisabled,
                    })

                    targetDate.value = "";
                    targetDate.setAttribute("value", "")
                }
                // 若正常流程選擇下 ， 按照選擇的展覽刷新datepicker的資料
                else {
                    maxDate = correct[0].show.endDate;
                    datesDisabled = correct[0].show.restDay;
                    daysOfWeekDisabled = correct[0].show.restDayOfWeek;
                    minDate = correct[0].show.startDate;

                    console.log(minDate)
                    datepicker.setOptions({
                        maxDate: maxDate,
                        datesDisabled: datesDisabled,
                        daysOfWeekDisabled: daysOfWeekDisabled,
                        minDate : minDate
                    })
                    member_date_select.setAttribute("value", "");
                    member_date_select.value = "";

                }
            }
        } else {

            // 當使用者選取的類別"不是"我的收藏時
            if (targetShow !== "請選擇類別") {
                correct = data.filter(i => i.title === target)

                // 若選擇的活動日期 大於 B活動結束日期 ，將做提醒
                if (correct[0].endDate < targetDate.value) {
                    Swal.fire({
                        title: '您選擇的日期此活動已結束<br/>再重新選擇，謝謝',
                        scrollbarPadding: false,
                        heightAuto: false,
                        showConfirmButton: false,
                        confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
                        timer: 3000
                    })

                    // 並將日曆復位
                    maxDate = correct[0].endDate;
                    datesDisabled = correct[0].restDay;
                    daysOfWeekDisabled = correct[0].restDayOfWeek;

                    datepicker.setOptions({
                        maxDate: maxDate,
                        datesDisabled: datesDisabled,
                        daysOfWeekDisabled: daysOfWeekDisabled,
                    })

                    targetDate.value = "";
                    targetDate.setAttribute("value", "")
                }
                // 正常流程選擇下 ， 按照選擇的展覽刷新datepicker的資料
                else {
                    maxDate = correct[0].endDate;
                    datesDisabled = correct[0].restDay;
                    daysOfWeekDisabled = correct[0].restDayOfWeek;
                    minDate = correct[0].startDate;

                    datepicker.setOptions({
                        maxDate: maxDate,
                        datesDisabled: datesDisabled,
                        daysOfWeekDisabled: daysOfWeekDisabled,
                        minDate : minDate
                    })

                    member_date_select.setAttribute("value", "");
                    member_date_select.value = "";

                }
            }
        }
    })


    // 若使用者未選活動即選擇日期，將跳出提醒
    member_date_select.addEventListener("click", e => {
        let targetShow = member_show_select.value;

        if (targetShow === "請選擇想參加的展演") {
            Swal.fire({
                title: '請先選擇想參加的活動<br/>再選擇日期，謝謝',
                scrollbarPadding: false,
                heightAuto: false,
                showConfirmButton: false,
                confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
                timer: 2500
            })
        }
    })


    // 負責看使用者是否按加入收藏
    memberPage_showassistant_info.addEventListener("click", e => {
        showId = e.target.getAttribute("data-show-id");
        if (e.target.textContent === "加入收藏清單") {
            e.preventDefault();

            // 收藏活動前，判斷使用者是否已加入會員 & 收藏活動
            memberOrNot()
        }
    })



    // 負責使用者完整選擇資料，點選查詢後，做相對應查詢結果渲染及防呆
    showassistant_Inquire.addEventListener("click", e => {
        e.preventDefault();
        let targetShow = member_show_select.value;
        let targetDate = member_date_select;

        chooseDate = member_date_select.value
        startTime = member_date_select.value.replace(/[/]+/gm, "-");

        // 如果使用者沒有點選活動或日期，提醒先選擇
        if (targetShow === "請選擇想參加的展演" || targetDate.value === ``) {
            Swal.fire({
                title: '請先選擇想參加的活動及日期~',
                scrollbarPadding: false,
                heightAuto: false,
                showConfirmButton: false,
                confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
                timer: 2500
            })
        } else {

            // 使用者選定的日期轉換
            let dateTime = new Date(member_date_select.value);

            // 今天的日期轉換
            let current = new Date(today);
            // 即將結束 - 今天日期 = 取得差距毫秒
            let gapTime = dateTime.getTime() - current.getTime();
            // 毫秒轉換為天數
            weatherDayLimit = ((((gapTime / 1000) / 60) / 60) / 24) + 1;

            let targetLocation = member_location_select.value;
            let targetDate = member_date_select.value;

            if (targetLocation === "我的收藏") {
                correct = data.filter(i => i.show.title === targetShow)





                coordinate.lat = correct[0].show.lat;
                coordinate.lng = correct[0].show.lng;




                if (weatherDayLimit <= 7) {
                    weather()
                } else {
                    member_renderShowAssistant_resultShowInfo(memberPage_showassistant_info, member_weatherBox)
                }

            } else {
                correct = data.filter(i => i.title === targetShow)

                coordinate.lat = correct[0].lat;
                coordinate.lng = correct[0].lng;
                if (weatherDayLimit <= 7) {
                    weather()
                } else {
                    member_renderShowAssistant_resultShowInfo(memberPage_showassistant_info, member_weatherBox)
                }

            }

        }
    })




    // 按照查詢結果送出所獲取的經緯度資訊，渲染本頁Google地圖
    // Initialize and add the map
    function initMap() {

        // const mapLocation = coordinate;

        // The map
        let map = new google.maps.Map(document.getElementById("member-map"), {
            zoom: 15,
            center: { lat: coordinate.lat, lng: coordinate.lng },
        });
        // The marker
        let marker = new google.maps.Marker({
            position: { lat: coordinate.lat, lng: coordinate.lng },
            map: map,
        });
    }
    window.initMap = initMap;

}



// 負責取得全部活動 或 分區域之活動 並渲染
function selectShowArea(target) {

    axios.get(`http${secure}://${api_domain}/shows`)
        .then(response => {

            data = response.data;

            // 排除日期已過期的活動
            data = response.data.filter(i => {

                if (i.endDate >= today && i.locationName === target) {
                    return i
                }

            })

            // 依照活動結束時間由近至遠排序
            data.sort(function (a, b) {
                if (a.endDate > b.endDate) {
                    return 1;
                } else if (a.endDate < b.endDate) {
                    return -1;
                } else {
                    return 0;
                }
            })


            renderShowAssistantSelect(member_show_select)

        }).catch(error => {
            console.log(error);
        })
}

// 負責取得收藏閘活動  並渲染
function selectShowArea_favorite() {
    axios.get(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList?userId=${localStorage.getItem("userId")}&_expand=show`, headers)
        .then(response => {

            // 排除日期已過期的活動
            data = response.data.filter(i => i.show.endDate >= today)

            // 依照活動結束時間由近至遠排序
            data.sort((a, b) => {
                if (a.show.endDate > b.show.endDate) {
                    return 1;
                } else if (a.show.endDate < b.show.endDate) {
                    return -1;
                } else {
                    return 0;
                }
            })

            renderShowAssistantSelect_favorite(member_show_select)

        }).catch(error => {
            console.log(error)
            tokenOverTime = error.response.request.statusText;
            if (tokenOverTime === "Unauthorized") {
                // token過期，將使用者登出並提醒
                overtime()
            } else if (tokenOverTime === "Forbidden") {
                // 當使用 localhost 或 vercel 刪除至0筆時會挑出Forbidden 403錯誤，將之導引至此
                Swal.fire({
                    title: '目前沒有查詢中的活動<br>快去逛逛有沒有喜歡的展覽吧!',
                    showDenyButton: false,
                    showCancelButton: true,
                    cancelButtonText: `<span class="btn btn-outline-dark fs--7 font-Montserrat">OK</span>`,
                    scrollbarPadding: false,
                    heightAuto: false,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                })
            }
            // 當使用 render 刪除至0筆時會挑出status 403錯誤，將之導引至此
            else if (error.response.request.status === 403) {
                Swal.fire({
                    title: '目前沒有查詢中的活動<br>快去逛逛有沒有喜歡的展覽吧!',
                    showDenyButton: false,
                    showCancelButton: true,
                    cancelButtonText: `<span class="btn btn-outline-dark fs--7 font-Montserrat">OK</span>`,
                    scrollbarPadding: false,
                    heightAuto: false,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                })
            }
            else {
                // 登入資料異常，將使用者登出並提醒
                alert("vercel資料異常403，將為您登出，請稍後再試")
                // overtime()
            }
        })
}

//渲染至HTML select for favorite 用功能
function renderShowAssistantSelect_favorite(target) {

    let str = `<option selected value="請選擇想參加的展演" disabled></option>`

    data.forEach(i => {

        str += `<option value="${i.show.title}" data-lat="${i.show.lat}" data-ing="${i.show.ing}">${i.show.title}</option>`
    })
    target.innerHTML = str;
}

// 天氣預報資訊get
function weather() {

    let targetLocation = member_location_select.value;

    let locationNameCode = ``;

    if (targetLocation === "我的收藏") {
        correct[0].show.locationName === "松山文創園區" ? locationNameCode = "%E4%BF%A1%E7%BE%A9%E5%8D%80" : locationNameCode = "%E4%B8%AD%E6%AD%A3%E5%8D%80";
    } else {
        correct[0].locationName === "松山文創園區" ? locationNameCode = "%E4%BF%A1%E7%BE%A9%E5%8D%80" : locationNameCode = "%E4%B8%AD%E6%AD%A3%E5%8D%80";
    }



    if (chooseDate === today) {
        axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-976EAD4A-554A-4DFE-9AB2-675A11E36DC8&locationName=${locationNameCode}&elementName=&startTime=${startTime}T18%3A00%3A00`)
            .then(response => {


                locationAreaName = response.data.records.locations[0].location[0].locationName
                locationWeatherPoP = response.data.records.locations[0].location[0].weatherElement[0].time[0].elementValue[0].value
                locationWeatherT = response.data.records.locations[0].location[0].weatherElement[1].time[0].elementValue[0].value
                locationWeatherPoPIcon = ``;

                if (locationWeatherPoP === " ") {
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



                member_renderShowAssistant_resultShowInfo(memberPage_showassistant_info, member_weatherBox)

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



                member_renderShowAssistant_resultShowInfo(memberPage_showassistant_info, member_weatherBox)

            }).catch(error => {
                console.log(error);
            })
    }


}

// 不刷新頁面下重新刷新地圖資訊
function updateMap(latitude, longitude) {


    // The map
    let map = new google.maps.Map(document.getElementById("member-map"), {
        zoom: 15,
        center: { lat: latitude, lng: longitude },
    });
    // The marker
    let marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
    });
}

// 渲染查詢結果
function member_renderShowAssistant_resultShowInfo(location, weatherArea) {

    let str = ``;

    let weather = ``;

    let targetLocation = member_location_select.value;

    if (targetLocation === "我的收藏") {
        if (weatherDayLimit <= 7) {

            str = `<div class="d-flex flex-column flex-lg-row align-items-center mb-5">
                            <img src="${correct[0].show.imgUrl}"
                                alt="展演" style="max-height: 200px;" class="me-0 me-lg-6 mb-6 mb-lg-0 rounded-3">
                            <div class="flex-grow-1">
                                <h2 class="fs--11 fs-sm-14 text-center">${correct[0].show.title}</h2>
                            </div>
                        </div>
                        <hr>
                        <p class="fs--9 mb-5 fw-bold">您欲參加的活動位於台北市 ${locationAreaName}，詳細展覽資訊及地圖如下，當天平均溫度為 ${locationWeatherT}度，該區降雨機率為 ${locationWeatherPoP}%，資訊供您參考。</p>
                        <div class="d-lg-flex justify-content-between mb-6">
                            <ul>
                                <li class="mb-1">
                                    <strong class="me-2">展出地點 :</strong> <span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.location}</span>
                                </li>
                                <li class="mb-1">
                                    <strong class="me-2">票價 : </strong><span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.price}</span>
                                </li>
                                <li class="mb-1">
                                    <strong class="me-2">展出日期 : </strong><span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.startDate} –
                                        ${correct[0].show.endDate}</span>
                                </li>
                                <li>
                                    <strong class="me-2">展出時段 : </strong><span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.startTime}  -
                                        ${correct[0].show.endTime}
                                        </span>
                                </li>
                            </ul>
                            <div class="d-flex justify-content-center align-items-end">
                                <button type="button"
                                    class="btn btn-outline-dark d-none d-lg-block" data-show-id=${correct[0].show.id}>加入收藏清單</button>
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
                        <img src="${correct[0].show.imgUrl}"
                            alt="展演" style="max-height: 200px;" class="me-0 me-lg-6 mb-6 mb-lg-0 rounded-3">
                        <div class="flex-grow-1">
                            <h2 class="fs--11 fs-sm-14 text-center">${correct[0].show.title}</h2>
                        </div>
                    </div>
                    <hr>
                    <p class="fs--9 mb-5 fw-bold">您欲參加的活動位於台北市，詳細展覽資訊及地圖如下，資訊供您參考，目天氣預報功能支援7天內的查詢，還請出發前多加利用。</p>
                    <div class="d-lg-flex justify-content-between mb-6">
                        <ul>
                            <li class="mb-1">
                                <strong class="me-2">展出地點 :</strong> <span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.location}</span>
                            </li>
                            <li class="mb-1">
                                <strong class="me-2">票價 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.price}</span>
                            </li>
                            <li class="mb-1">
                                <strong class="me-2">展出日期 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.startDate} –
                                    ${correct[0].show.endDate}</span>
                            </li>
                            <li>
                                <strong class="me-2">展出時段 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].show.startTime}  -
                                    ${correct[0].show.endTime}
                                    </span>
                            </li>
                        </ul>
                        <div class="d-flex justify-content-center align-items-end">
                            <button type="button"
                                class="btn btn-outline-dark d-none d-lg-block" data-show-id=${correct[0].show.id}>加入收藏清單</button>
                        </div>
                        </div>`

            weather = `<div class="d-flex flex-column justify-content-evenly">
                         <h3 class="text-center">目前預報僅支援7天內查詢<br/>還請出發前多加利用</h3>
                       </div>`

        }

        location.innerHTML = str;
        weatherArea.innerHTML = weather;
        gsap.to(".weatherIcon", { y: -15, duration: 4, repeat: -1 })

    } else {

        if (weatherDayLimit <= 7) {
            str = `<div class="d-flex flex-column flex-lg-row align-items-center mb-5">
                            <img src="${correct[0].imgUrl}"
                                alt="展演" style="max-height: 200px;" class="me-0 me-lg-6 mb-6 mb-lg-0 rounded-3">
                            <div class="flex-grow-1">
                                <h2 class="fs--11 fs-sm-14 text-center">${correct[0].title}</h2>
                            </div>
                        </div>
                        <hr>
                        <p class="fs--9 mb-5 fw-bold">您欲參加的活動位於台北市 ${locationAreaName}，詳細展覽資訊及地圖如下，當天平均溫度為 ${locationWeatherT}度，該區降雨機率為 ${locationWeatherPoP}%，資訊供您參考。</p>
                        <div class="d-lg-flex justify-content-between mb-6">
                            <ul>
                                <li class="mb-1">
                                    <strong class="me-2">展出地點 :</strong> <span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].location}</span>
                                </li>
                                <li class="mb-1">
                                    <strong class="me-2">票價 : </strong><span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].price}</span>
                                </li>
                                <li class="mb-1">
                                    <strong class="me-2">展出日期 : </strong><span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].startDate} –
                                        ${correct[0].endDate}</span>
                                </li>
                                <li>
                                    <strong class="me-2">展出時段 : </strong><span
                                        class="font-Montserrat fs--7 fs-sm-8">${correct[0].startTime}  -
                                        ${correct[0].endTime}
                                        </span>
                                </li>
                            </ul>
                            <div class="d-flex justify-content-center align-items-end">
                                <button type="button"
                                    class="btn btn-outline-dark d-none d-lg-block" data-show-id=${correct[0].id}>加入收藏清單</button>
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
                        <img src="${correct[0].imgUrl}"
                            alt="展演" style="max-height: 200px;" class="me-0 me-lg-6 mb-6 mb-lg-0 rounded-3">
                        <div class="flex-grow-1">
                            <h2 class="fs--11 fs-sm-14 text-center">${correct[0].title}</h2>
                        </div>
                    </div>
                    <hr>
                    <p class="fs--9 mb-5 fw-bold">您欲參加的活動位於台北市，詳細展覽資訊及地圖如下，資訊供您參考，目天氣預報功能支援7天內的查詢，還請出發前多加利用。</p>
                    <div class="d-lg-flex justify-content-between mb-6">
                        <ul>
                            <li class="mb-1">
                                <strong class="me-2">展出地點 :</strong> <span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].location}</span>
                            </li>
                            <li class="mb-1">
                                <strong class="me-2">票價 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].price}</span>
                            </li>
                            <li class="mb-1">
                                <strong class="me-2">展出日期 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].startDate} –
                                    ${correct[0].endDate}</span>
                            </li>
                            <li>
                                <strong class="me-2">展出時段 : </strong><span
                                    class="font-Montserrat fs--7 fs-sm-8">${correct[0].startTime}  -
                                    ${correct[0].endTime}
                                    </span>
                            </li>
                        </ul>
                        <div class="d-flex justify-content-center align-items-end">
                            <button type="button"
                                class="btn btn-outline-dark d-none d-lg-block" data-show-id=${correct[0].id}>加入收藏清單</button>
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

    member_date_select.setAttribute("value", "");
    member_date_select.value = "";
    member_map.classList.remove("d-none")

    // 取得使用者新查詢的地圖座標
    let latitude = coordinate.lat
    let longitude = coordinate.lng

    // 刷新地圖座標
    updateMap(latitude, longitude);

}

