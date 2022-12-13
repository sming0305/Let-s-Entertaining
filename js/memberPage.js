if (body.classList[4] === "memberPage") {

    //取得展演收藏匣完整清單 並 渲染會員首頁 & 即將結束的活動 >> 提醒會員 
    getFavoriteShowList()

    //  若使用者點擊刪除收藏展演，進行刪除，刪除後重新刷新會員首頁
    member_notice.addEventListener("click", e => {

        let deleteId = e.target.getAttribute("data-favoriteshow-id");

        if (e.target.textContent === "從收藏清單移除") {
            e.preventDefault();


            axios.delete(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList/${deleteId}`, headers)
                .then(response => {
                    getFavoriteShowList()
                }).catch(error => {
                    console.log(error)
                    tokenOverTime = error.response.request.statusText === "Unauthorized"
                    overtime()
                })

        }
    });
}

// 取得最愛展演清單 & 按日期正確排序 & 計算出剩餘天數  & 最終僅顯示第一筆提醒會員
function getFavoriteShowList() {

    axios.get(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList?userId=${localStorage.getItem("userId")}&_expand=show`, headers)
        .then(response => {

            console.log(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList?userId=${localStorage.getItem("userId")}&_expand=show`)
            console.log(headers)

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

            // 最近一筆即將結束的展覽日期
            let listOneShowEndDate = new Date(data[0].show.endDate);
            // 今天的日期
            let current = new Date(today);
            // 即將結束 - 今天日期 = 取得差距毫秒
            let gapTime = listOneShowEndDate.getTime() - current.getTime();
            // 毫秒轉換為天數
            let gapDay = (((gapTime/1000)/60)/60)/24;

            // 取得展演剩餘天數
            gap = gapDay;


            renderMemberIndex()

        }).catch(error => {
            tokenOverTime = error.response.request.statusText;
            if (tokenOverTime === "Unauthorized") {
                overtime()
            }else if(tokenOverTime === "Forbidden"){
                let str = `<div class="d-flex align-items-center justify-content-center h-100"><p class="fs--14">目前沒有收藏的活動，快去看看有沒有喜歡的展演吧~</p></div>`;
                member_notice.innerHTML = str;
            }else{
                console.log(error)
                console.log(error.response.data)
                console.log(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList?userId=${localStorage.getItem("userId")}&_expand=show`)
                console.log(headers)
                alert("vercel資料異常403，將為您登出，請稍後再試");
                overtime()
            }

        })
}

// 渲染會員首頁的展演提醒
function renderMemberIndex() {

    let str =`<p class="fs--9 fs-sm-13 ps-4 mb-6">提醒您 : 您收藏的展演活動“${data[0].show.title}”
                     <br />展期倒數 <span class="text-danger fw-bold">${gap}</span> 天，記得在展期結束前前往參加。</p>
                 <div class="d-lg-flex justify-content-between">
                     <img src="${data[0].show.imgUrl}"
                         alt="展演圖片" style="max-height: 360px;" class="me-6">
                     <ul class="row sticky-top top_160  mb-12 mb-lg-0">
                         <li class="d-flex d-sm-block align-items-center mb-2 mb-sm-6 col-lg-12 col-sm-6 pt-6 pt-lg-0">
                             <strong class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">展出日期 :
                             </strong>
                             <p class="fs--7 fs-sm-8">${data[0].show.startDate} – ${data[0].show.endDate}</p>
                         </li>
                         <li class="d-flex d-sm-block align-items-center mb-2 mb-sm-6 col-lg-12 col-sm-6 pt-sm-6 pt-lg-0">
                             <strong class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">展出時段 :
                             </strong>
                             <p class="fs--7 fs-sm-8">${data[0].show.startTime} - ${data[0].show.endTime}</p>
                         </li>
                         <li class="d-flex d-sm-block align-items-center mb-2 mb-sm-6 col-lg-12 col-sm-6 "><strong
                                 class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">展出地點 :
                             </strong>
                             <p class="fs--7 fs-sm-8">${data[0].show.location}</p>
                         </li>
                         <li class="d-flex d-sm-block align-items-center mb-4 mb-sm-6 col-lg-12 col-sm-6 "><strong
                                 class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">票價 :
                             </strong>
                             <p class="fs--7 fs-sm-8">${data[0].show.price}</p>
                         </li>
                         <li class="d-flex justify-content-center d-lg-block pb-2 pb-lg-0">
                             <a href="#" class="btn btn-outline-danger btn-sm me-4" data-favoriteshow-id="${data[0].id}">從收藏清單移除</a>
                             <a href="./showinfo.html?id=${data[0].show.id}" class="btn btn-outline-dark btn-sm" target="_new">詳細介紹</a>
                         </li>
                     </ul>
                 </div>`;
    
    member_notice.innerHTML = str;
}

