if (body.classList[4] === "showlist") {

    // 偵測展演列表頁 使用者點擊 將活動加入收藏時
    fullShowList.addEventListener("click", e => {

        showId = e.target.getAttribute("data-show-id");
        if (e.target.textContent === "加入收藏清單") {
            e.preventDefault();

            // 收藏活動前，判斷使用者是否已加入會員 & 收藏活動
            memberOrNot()
        }
    })

    showList_location.addEventListener("change", e => {

        // 依照使用者change select option 呈現畫面
        // 邏輯共用 參閱memberPage select function，僅傳入參數(選取的DOM)及頁面條件不同，但此處不用考慮收藏清單問題
        getMemberShowList(showList_location, showList_date, fullShowList)
    })
        // 依照使用者change select option 呈現畫面 
        // 邏輯共用 參閱memberPage select function，僅傳入參數(選取的DOM)及頁面條件不同，但此處不用考慮收藏清單問題
    showList_date.addEventListener("change", e => {
        getMemberShowList(showList_location, showList_date, fullShowList)
    })


}