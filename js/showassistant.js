if (body.classList[4] === "showassistant") {



    //取得看展小幫手所需的展演資料
    getShowInfo(showassistantLocation)

    // vanillajs-datepicker 日曆套件設定
    const elem = document.querySelector('input[name="date"]');
    const datepicker = new Datepicker(elem, {
        language: 'zh-TW', // 語系設定，要額外載入JS
        minDate: 'auto', // 最小可選日期
        autohide: true,
        clearBtn: true,
        maxDate: maxDate, // 最大可選日期，用來設定展覽結束日
        datesDisabled: [], // 單日設定不可選取的日期，陣列內每筆資料字串日期，用來設定特殊休館日
        daysOfWeekDisabled: [] // 設定每週固定不可選的日期，陣列內每筆資料數字號碼，0為星期日 1為禮拜1，依此類推，用來設定固定休館日
    });

    // 使用者送出查詢時，將查詢的展覽ID 及經緯座標放置至網址上，供結果渲染及Google Map抓取經緯度
    showassistant_Inquire.addEventListener("click", e => {
        e.preventDefault();
        let targetShow = showassistantLocation.value;
        let targetDate = showassistantDate.value;

        // 如果使用者沒有點選活動或日期，提醒先選擇
        if (targetShow === "請選擇想參加的展演" || targetDate === ``) {
            Swal.fire({
                title: '請先選擇想參加的活動及日期~',
                scrollbarPadding: false,
                heightAuto: false,
                showConfirmButton: false,
                confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
                timer: 2500
            })
        } else {
            let correct = data.filter(i => i.title === targetShow)
            location.href = `./showassistant-result.html?showId=${correct[0].id}&Iat=${correct[0].lat}&lng=${correct[0].lng}&Date=${targetDate}`;
        }
    })

    // 監聽使用者切換活動input狀況，做相應反饋
    showassistantLocation.addEventListener("change", e => {

        let targetShow = showassistantLocation.value;
        let targetDate = showassistantDate;


        // 如果使用者點選A活動日期 再回來改選活動B
        if (targetShow !== "請選擇想參加的展演") {

            let correct = data.filter(i => i.title === targetShow)

            // 且選擇的活動日期 大於 B活動結束日期 ，將做提醒
            if (correct[0].endDate < targetDate.value) {
                Swal.fire({
                    title: '您選擇的日期此活動已結束<br/>再重新選擇，謝謝',
                    scrollbarPadding: false,
                    heightAuto: false,
                    showConfirmButton: false,
                    confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
                    timer: 3000
                })

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

                datepicker.setOptions({
                    maxDate: maxDate,
                    datesDisabled: datesDisabled,
                    daysOfWeekDisabled: daysOfWeekDisabled,
                })

                targetDate.value = "";
                targetDate.setAttribute("value", "")

            }

        }
    })

    // 若使用者未選活動即選擇日期，將跳出提醒
    showassistantDate.addEventListener("click", e => {
        let targetShow = showassistantLocation.value;

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

}


// 取得看展小幫手所需的展演資料
function getShowInfo(target) {

    axios.get(`http${secure}://${api_domain}/shows`)
        .then(response => {

            data = response.data

            // 排除日期已過期的活動
            data = response.data.filter(i => i.endDate >= today)

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

            renderShowAssistantSelect(target)

        }).catch(error => {
            console.log(error);
        })
}

//渲染至HTML select 功能
function renderShowAssistantSelect(target) {

    let str = `<option selected value="請選擇想參加的展演" disabled></option>`

    data.forEach(i => {

        str += `<option value="${i.title}" data-lat="${i.lat}" data-ing="${i.ing}">${i.title}</option>`
    })
    target.innerHTML = str;
}

