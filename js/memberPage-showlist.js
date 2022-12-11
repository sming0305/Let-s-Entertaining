if (body.classList[4] === "memberPage-showlist") {


    //取得展演收藏匣完整清單 並 渲染 
    getFavoriteShowList_select()

    //  若使用者點擊刪除收藏展演，進行刪除，刪除後重新刷清單
    member_showList.addEventListener("click", e => {

        let deleteId = e.target.getAttribute("data-favoriteshow-id");
        if (e.target.textContent === "從收藏清單移除") {
            e.preventDefault();
            axios.delete(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList/${deleteId}`, headers)
                .then(response => {
                    getFavoriteShowList_select()
                }).catch(error => {
                    console.log(error)
                    tokenOverTime = error.response.request.statusText === "Unauthorized"
                    overtime()
                })
        }
    })

    
    member_location.addEventListener("change", e => {

    })

    member_date.addEventListener("change", e => {

    })

}



// 取得展演收藏匣完整清單
function getFavoriteShowList_select() {

    // 取得今天日期，並確保格式一致
    let day = new Date()
    let today = `${day.getFullYear()}/${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`

    axios.get(`http://${api_domain}/${Guarded_routes}showFavoriteList?userId=${localStorage.getItem("userId")}&_expand=show`, headers)
        .then(response => {
            console.log(response)

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

            renderMemberShowList(data)


        }).catch(error => {
            console.log(error)
            tokenOverTime = error.response.request.statusText;
            if (tokenOverTime === "Unauthorized") {
                overtime()
            } else if (tokenOverTime === "Forbidden") {
                let str = `<li class="d-flex align-items-center justify-content-center h-100"><p class="fs--14">目前沒有收藏的活動，快去看看有沒有喜歡的展演吧~</p></li>`;
                member_showList.innerHTML = str;
            }
            else {
                alert("登入資訊環節異常，請檢查console");
                overtime()
            }

        })
}


// 渲染會員展演收藏閘
function renderMemberShowList(dataBase) {

    let str = ``;

    dataBase.forEach(i => {

        str += `<li class="mb-3 col-12  col-xl-12 mb-4">
                   <div class="card  border-bottom border-black bg-transparent" style="min-height: 80px;">
                       <div class="row g-0">
                           <div class="col-4 col-lg-3 col-xxl-2">
                               <a href="#"><img
                                       src="${i.show.imgUrl}"
                                       class="img-fluid img--size1" alt="展演"></a>
                           </div>
                           <div class="col-8 col-lg-9 col-xxl-10">
                               <div
                                   class="card-body p-1 p-sm-2 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between h-100">
                                   <div>
                                       <a href="#">
                                           <h5 class="fs--7 fs-sm-8 fs-lg-12 textLineOverflow">${i.show.title}
                                           </h5>
                                       </a>
                                       <p class="card-text fs--6 fs-sm-8">${i.show.startDate} – ${i.show.endDate}</p>
                                       <p class="card-text d-none d-lg-block"><small>${i.show.startTime} - ${i.show.endTime}</small>
                                           <small>${i.show.locationName}</small>
                                       </p>
                                   </div>
                                   <div class="d-flex justify-content-end flex-shrink-0">
                                       <a href="./showinfo.html?id=${i.show.id}"
                                           class="btn btn-sm fs-7 fs-sm-8 d-none d-xs-block me-2 btn-outline-dark" target="_new">詳細介紹</a>
                                       <a href="#" class="btn btn-sm fs-7 fs-sm-8 btn-outline-danger" data-favoriteshow-id="${i.id}">從收藏清單移除</a>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </li>`;
    })

    member_showList.innerHTML = str;

}



