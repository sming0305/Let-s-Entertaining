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
}