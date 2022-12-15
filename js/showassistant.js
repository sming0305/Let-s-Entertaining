if (body.classList[4] === "showassistant") {


    getShowInfo()

    // vanillajs-datepicker 日曆套件設定
    const elem = document.querySelector('input[name="date"]');
    const datepicker = new Datepicker(elem, {
        
        language: 'zh-TW',
        minDate: 'auto',
        autohide: true,
        clearBtn: true,
        maxDate: maxDate,
        datesDisabled: [],
        daysOfWeekDisabled: []
    });


    // 使用者按查詢時，將查詢的展覽ID 及經緯座標放置至網址上
    showassistant_Inquire.addEventListener("click", e => {
        e.preventDefault();
        let targetShow = showassistantLocation.value;
        let targetDate = showassistantDate.value;

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

            location.href = `./showassistant-result.html?showId=${correct[0].id}&Iat=${correct[0].lat}&lng=${correct[0].lng}`
        }
    })



    showassistantLocation.addEventListener("change", e => {

        let targetShow = showassistantLocation.value;
        let targetDate = showassistantDate;

        if (targetShow === "請選擇想參加的展演") {
            datepicker.setOptions({
                maxDate: today,
            })
            targetDate.value = "";
            targetDate.setAttribute("value", "")

        } else if (targetShow !== "請選擇想參加的展演") {

            let correct = data.filter(i => i.title === targetShow)

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
            } else {
                maxDate = correct[0].endDate;
                datesDisabled = correct[0].restDay;
                daysOfWeekDisabled = correct[0].restDayOfWeek;

                datepicker.setOptions({
                    maxDate: maxDate,
                    datesDisabled: datesDisabled,
                    daysOfWeekDisabled: daysOfWeekDisabled,
                })
            }

        }
    })

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
function getShowInfo() {

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

            renderShowAssistantSelect()

        }).catch(error => {
            console.log(error);
        })
}

//渲染至HTML select 功能
function renderShowAssistantSelect() {

    let str = `<option selected value="請選擇想參加的展演"></option>`

    data.forEach(i => {

        str += `<option value="${i.title}" data-lat="${i.lat}" data-ing="${i.ing}">${i.title}</option>`
    })
    showassistantLocation.innerHTML = str;
}

