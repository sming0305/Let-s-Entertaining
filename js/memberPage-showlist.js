if (body.classList[4] === "memberPage-showlist") {


    //首次切換到此頁，取得展演收藏匣完整清單 並 渲染 
    getFavoriteShowList_select()

    //  若使用者點擊刪除收藏展演 or 加入收藏清單，進行相應處理，之後重新刷清單
    member_showList.addEventListener("click", e => {

        // 取得使用者點擊的最愛展覽ID
        let deleteId = e.target.getAttribute("data-favoriteshow-id");

        // 點擊刪除處理
        if (e.target.textContent === "從收藏清單移除") {
            e.preventDefault();
            axios.delete(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList/${deleteId}`, headers)
                .then(response => {
                    getFavoriteShowList_select()
                }).catch(error => {
                    console.log(error)
                    tokenOverTime = error.response.request.statusText === "Unauthorized"
                    if (tokenOverTime === "Unauthorized") {
                        // token過期，將使用者登出並提醒
                        overtime()
                    } else if (tokenOverTime === "Forbidden") {
                        // 收藏清單被刪除至0筆時會跳出"Forbidden"
                        let str = `<li class="d-flex align-items-center justify-content-center h-100"><p class="fs--14">目前沒有收藏的活動，快去看看有沒有喜歡的展演吧~</p></li>`;
                        member_showList.innerHTML = str;
                    }
                    else {
                        // 登入資料異常，將使用者登出並提醒
                        alert("vercel資料異常403，將為您登出，請稍後再試")
                        overtime()
                    }
                })
        }// 點擊添加
        else if (e.target.textContent === "加入收藏清單") {
            // 取得使用者點擊想加入的展覽ID
            showId = e.target.getAttribute("data-show-id");
            // 執行加入收藏的程序
            memberOrNot()
        }
    })

    // 篩選列---展出地區監聽>>監看使用者想切換到哪區的展覽
    member_location.addEventListener("change", e => {

        let target = e.target.value;

        if (target === "我的收藏") {
            // 如是選擇我的收藏，將請求最愛清單並渲染程序
            getFavoriteShowList_select()
        } else {
            // 如果是非收藏清單，將執行非收藏清單的請求程序
            getMemberShowList()
        }
    })

    // 篩選列---展出月份監聽>>監看使用者想切換到月份的展覽
    member_date.addEventListener("change", e => {


        // 如果是在我的收藏的狀態下，用渲染收藏清單的程序
        if (member_location.value === "我的收藏") {
            getFavoriteShowList_select()
        } else {

            // 其他狀況都用非收藏清單的程序
            getMemberShowList()
        }
    })

}


// 取得展演收藏匣完整清單
function getFavoriteShowList_select() {

    // get 該會員的專屬收藏清單
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

            //  如果選擇不分月份的全部活動
            if (member_date.value === "全部活動") {
                // 將收藏清單的所有活動月份innerHTML塞入
                selectDate()
                // 然後渲染會員收藏清單
                renderMemberFavoriteShowList()
            }
            // 此function放在監聽內，所以如果會員有選擇其他月份，會導引至此
            else {

                //copy一個整理好日期排序的data
                let copy = data

                // 用data跑filter 篩選出會員選擇想看到指定月份的資料
                data = copy.filter(i => {

                    // 邏輯是 > 先拆分data內每個活動的日期格式成為 ex: 2022-12，再跟使用者點選的月份對比
                    // 1.如果該活動的 結束時間 大於 會員所選擇的日期 ，代表活動仍在進行 可以保留
                    // 2.如果該活動的 開始時間 小於 會員所選擇的日期 ，代表活動已經開始 可以保留
                    if (`${i.show.endDate.split("/")[0]}-${i.show.endDate.split("/")[1]}` >= member_date.value &&
                        `${i.show.startDate.split("/")[0]}-${i.show.startDate.split("/")[1]}` <= member_date.value) {

                        //若條件都成立 return該活動
                        return i
                    }
                })
                //渲染篩選過的陣列資料
                renderMemberFavoriteShowList()
            }

        }).catch(error => {
            console.log(error)
            tokenOverTime = error.response.request.statusText;
            if (tokenOverTime === "Unauthorized") {
                // token過期，將使用者登出並提醒
                overtime()
            } else if (tokenOverTime === "Forbidden") {
                // 收藏清單被刪除至0筆時會跳出"Forbidden"
                let str = `<li class="d-flex align-items-center justify-content-center h-100"><p class="fs--14">目前沒有收藏的活動，快去看看有沒有喜歡的展演吧~</p></li>`;
                member_showList.innerHTML = str;
            }
            else {
                // 登入資料異常，將使用者登出並提醒
                alert("vercel資料異常403，將為您登出，請稍後再試")
                overtime()
            }
        })
}

// 渲染會員收藏的展演活動
function renderMemberFavoriteShowList() {

    let str = ``;

    data.forEach(i => {

        str += `<li class="mb-3 col-12  col-xl-12 mb-4">
                   <div class="card  border-bottom border-black bg-transparent" style="min-height: 80px;">
                       <div class="row g-0">
                           <div class="col-4 col-lg-3 col-xxl-2">
                               <a href="./showinfo.html?id=${i.show.id}" target="_new"><img
                                       src="${i.show.imgUrl}"
                                       class="img-fluid img--size1" alt="展演"></a>
                           </div>
                           <div class="col-8 col-lg-9 col-xxl-10">
                               <div
                                   class="card-body p-1 p-sm-2 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between h-100">
                                   <div>
                                       <a href="./showinfo.html?id=${i.show.id}" target="_new">
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

// 取得全部園區 & 分區  供select使用的展演列表清單
function getMemberShowList() {

    axios.get(`http${secure}://${api_domain}/shows`)
        .then(response => {

            // 確保活動未過期
            data = response.data.filter(i => i.endDate >= today)

            // 依照活動結束時間由近至遠排序
            data.sort((a, b) => {
                if (a.endDate > b.endDate) {
                    return 1;
                } else if (a.endDate < b.endDate) {
                    return -1;
                } else {
                    return 0;
                }
            })


            //如果兩個select都處於"全部"狀態 
            if (member_location.value === "全部園區") {
                if (member_date.value === "全部活動") {
                    // 抓出所有活動月份innerHTML進select
                    selectDate()
                    // 負責渲染非會員收藏清單列表的功能
                    renderMemberShowList()
                } else {

                    //copy一個整理好日期排序的data
                    let copy = data

                    // 用data跑filter 篩選出會員選擇想看到指定月份的資料
                    data = copy.filter(i => {

                        // 邏輯是 > 先拆分data內每個活動的日期格式成為 ex: 2022-12，再跟使用者點選的月份對比
                        // 1.如果該活動的 結束時間 大於 會員所選擇的日期 ，代表活動仍在進行 可以保留
                        // 2.如果該活動的 開始時間 小於 會員所選擇的日期 ，代表活動已經開始 可以保留
                        if (`${i.endDate.split("/")[0]}-${i.endDate.split("/")[1]}` >= member_date.value &&
                            `${i.startDate.split("/")[0]}-${i.startDate.split("/")[1]}` <= member_date.value) {
                            return i
                        }
                    })

                    //渲染篩選過的陣列資料
                    renderMemberShowList()
                }
            } else if (member_location.value === "華山文創") {

                // 只篩出 "華山1914文化創意產業園區" 且日期未過期的活動
                data = response.data.filter(i => i.locationName === "華山1914文化創意產業園區" && i.endDate >= today)

                // 按照日期排好
                data.sort((a, b) => {
                    if (a.endDate > b.endDate) {
                        return 1;
                    } else if (a.endDate < b.endDate) {
                        return -1;
                    } else {
                        return 0;
                    }
                })


                // 如果會員選擇全部時段活動，進行全時段渲染
                if (member_date.value === "全部活動") {
                    renderMemberShowList()
                } else {

                    // 篩選出會員指定月份
                    let copy = data
                    data = copy.filter(i => {

                        if (`${i.endDate.split("/")[0]}-${i.endDate.split("/")[1]}` >= member_date.value &&
                            `${i.startDate.split("/")[0]}-${i.startDate.split("/")[1]}` <= member_date.value) {
                            return i
                        }
                    })
                    renderMemberShowList()
                }


            } else if (member_location.value === "松山文創") {

                // 只篩出 "松山文創園區" 且日期未過期的活動
                data = response.data.filter(i => i.locationName === "松山文創園區" && i.endDate >= today)


                // 按照日期排好
                data.sort((a, b) => {
                    if (a.endDate > b.endDate) {
                        return 1;
                    } else if (a.endDate < b.endDate) {
                        return -1;
                    } else {
                        return 0;
                    }
                })


                // 如果會員選擇全部時段活動，進行全時段渲染
                if (member_date.value === "全部活動") {
                    renderMemberShowList()
                } else {

                    // 篩選出會員指定月份
                    let copy = data
                    data = copy.filter(i => {

                        if (`${i.endDate.split("/")[0]}-${i.endDate.split("/")[1]}` >= member_date.value &&
                            `${i.startDate.split("/")[0]}-${i.startDate.split("/")[1]}` <= member_date.value) {
                            return i
                        }
                    })
                    renderMemberShowList()
                }
            }
        }).catch(error => {
            console.log(error);
            tokenOverTime = error.response.request.statusText;
            if (tokenOverTime === "Unauthorized") {
                // token過期，將使用者登出並提醒
                overtime()
            } else if (tokenOverTime === "Forbidden") {
                // 收藏清單被刪除至0筆時會跳出"Forbidden"
                let str = `<li class="d-flex align-items-center justify-content-center h-100"><p class="fs--14">目前沒有收藏的活動，快去看看有沒有喜歡的展演吧~</p></li>`;
                member_showList.innerHTML = str;
            }
            else {
                // 登入資料異常，將使用者登出並提醒
                alert("vercel資料異常403，將為您登出，請稍後再試")
                overtime()
            }
        })
}

// 渲染全部園區 & 分區  供select使用的展演列表清單
function renderMemberShowList() {

    let str = ``;

    if (data[0] === undefined) {
        str = `<li class="d-flex align-items-center justify-content-center h-100"><p class="fs--14">該月份無相關展演活動</p></li>`;
        member_showList.innerHTML = str;
    } else {
        data.forEach(i => {


            str += `<li class="mb-3 col-12  col-xl-12 mb-4">
        <div class="card  border-bottom border-black bg-transparent" style="min-height: 80px;">
            <div class="row g-0">
                <div class="col-4 col-lg-3 col-xxl-2">
                    <a href="./showinfo.html?id=${i.id}" target="_new"><img
                            src="${i.imgUrl}"
                            class="img-fluid img--size1" alt="展演"></a>
                </div>
                <div class="col-8 col-lg-9 col-xxl-10">
                    <div
                        class="card-body p-1 p-sm-2 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between h-100">
                        <div>
                            <a href="./showinfo.html?id=${i.id}" target="_new">
                                <h5 class="fs--7 fs-sm-8 fs-lg-12 textLineOverflow">${i.title}
                                </h5>
                            </a>
                            <p class="card-text fs--6 fs-sm-8">${i.startDate} – ${i.endDate}</p>
                            <p class="card-text d-none d-lg-block"><small>${i.startTime} - ${i.endTime}</small>
                                <small>${i.locationName}</small>
                            </p>
                        </div>
                        <div class="d-flex justify-content-end flex-shrink-0">
                            <a href="./showinfo.html?id=${i.id}"
                                class="btn btn-sm fs-7 fs-sm-8 d-none d-xs-block me-2 btn-outline-dark" target="_new">詳細介紹</a>
                            <a href="#" class="btn btn-sm fs-7 fs-sm-8 btn-outline-black" data-show-id="${i.id}">加入收藏清單</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </li>`
        })
    }

    member_showList.innerHTML = str;
}

// 按照select選取不同條件的活動，取得對應的活動月份功能用於innerHTML
function selectDate() {

    let str = `<option value="全部活動" selected>全部活動</option>`;
    let HTMLdate = ``;


    // 將data所有活動跑一次，組合出有展覽的月份
    data.forEach(i => {

        let date = ``;


        if (member_location.value === "我的收藏") {
            //如果會員選擇"我的收藏"時，data的endDate 路徑
            date = i.show.endDate;
        } else {
            //如果會員選擇非收藏的展覽時，data的endDate 路徑
            date = i.endDate
        }

        //切割並將日期格式整合成 ex 2022-12
        let dateSplit = date.split("/");
        let merge = `${dateSplit[0]}-${dateSplit[1]}`

        // 如果切割出來的月份沒有重複，就將日期放入並用於innerHTML
        if (merge !== HTMLdate) {
            HTMLdate = merge
            str += `<option value="${HTMLdate}">${HTMLdate}</option>`
        }
    })


    // 組完後innerHTML
    member_date.innerHTML = str;
}

