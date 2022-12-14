if (body.classList[4] === "reviseinfo") {


    const reviseinfoBtn = document.querySelector(".reviseinfoBtn");
    const cancelBtn = document.querySelector(".cancelBtn");
    const form = document.querySelector("form");
    const alertTab = document.querySelectorAll(".validate_constraint");

    let changeName = document.querySelector(".changeName");
    let changeTel = document.querySelector(".changeTel");
    let changeEmai = document.querySelector(".changeEmai");
    let newPassword = document.querySelector(".newPassword");


    getUserInfo()
    allMemberInfo()


    reviseinfoBtn.addEventListener("click", e => {

        console.log(checkInfo)
        console.log(userInfo)

        let userName = document.querySelector(".changeName").value;
        let tel = document.querySelector(".changeTel").value;
        let mail = document.querySelector(".changeEmai").value;
        let password = document.querySelector(".newPassword").value;
        let oldPassword = document.querySelector(".oldPassword").value;
        let checkPassword = document.querySelector(".checkPassword").value;

        alertTab.forEach(i => { i.textContent = "" });

        if (changeName.value === userInfo.userName && changeTel.value === userInfo.tel && changeEmai.value === userInfo.email && newPassword.value === "") {
            Swal.fire({
                title: '偵測到資料未變更，您是否要繼續編輯',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: '<button type="button" class="btn btn-outline-dark fs--7 font-Montserrat">繼續編輯</button>',
                denyButtonText: `<a href="./memberPage.html" class="btn btn-outline-dark fs--7 font-Montserrat">回會員首頁</a>`,
                scrollbarPadding: false,
                heightAuto: false,
            })
        } else {
            // constraint >>  使用validate驗證前  建立的驗證條件
            let constraint = {
                變更名稱: {
                    presence: {
                        message: "為必填"
                    },
                    format: {
                        pattern: "[A-Za-z0-9\u4E00-\u9FA5]+",
                        message: "不可輸入特殊符號(允許中英數組合)"
                    },
                    length: {
                        maximum: 6,
                        message: "不可超過6字元"
                    }
                },
                變更號碼: {
                    presence: {
                        message: "為必填"
                    },
                    length: {
                        is: 10,
                        message: "必須為10碼"
                    },
                    numericality: {
                        onlyInteger: true,
                        greaterThanOrEqualTo: 0,
                        message: "只可輸入數字"
                    }
                },
                變更mail: {
                    presence: {
                        message: "為必填"
                    },
                    email: {
                        message: "格式錯誤，請輸入有效email"
                    }
                },
                新密碼: {
                    length: {
                        minimum: 8,
                        message: "至少8字元組合"
                    },
                    format: {
                        pattern: "[a-z0-9]+",
                        message: "限用英文及數字之字元組合"
                    }
                },
                再次輸入的密碼: {
                    equality: {
                        attribute: "新密碼",
                        message: "與新密碼不同，請重新輸入"
                    }, length: {
                        minimum: 8,
                        message: "至少8字元組合"
                    },
                    format: {
                        pattern: "[a-z0-9]+",
                        message: "限用英文及數字之字元組合"
                    }
                }
            }

            // 確認確認舊密碼是否正確
            let PASDCheck = oldPassword !== userInfo.checkPASD;


            if (PASDCheck) {
                document.querySelector(`[data-message="舊密碼"]`).textContent = "舊密碼輸入錯誤，請重新輸入";
            }

            // 使用 validate 驗證表單，validate回傳物件 每個屬性下有一個陣列值
            let result = validate(form, constraint);

            //在判斷式中，任何物件只要不是 undefined 或 null ，儘管是值為false 的 Boolean 物件，都會被轉換成true。舉例來說，下列的 if 判斷式中的布林值即為true。
            if (result) {

                //透過驗證器反饋的物件屬性，先用Object.keys轉換成陣列跑forEach，並用選擇器選擇到對應的每一筆HTML標籤後，將其反饋的內容逐一塞進HTML標籤內顯示出來。
                Object.keys(result).forEach(keys => {
                    document.querySelector(`[data-message="${keys}"]`).textContent = result[keys];
                })
            } 
            // 如果用戶更新了密碼但未填入2次驗證，提醒填入
            else if (password !== "" && checkPassword === "") {
                document.querySelector(`[data-message="再次輸入的密碼"]`).textContent = "請再次輸入密碼";
            }
            // 檢查客戶變更的 名稱 電話 mail 與其他使用者是否重複，如是則提醒。
            else if (checkMemberInfo(nameCheck = checkInfo.findIndex(i => userName === i.userName)) !== -1 ||
                checkMemberInfo(telCheck = checkInfo.findIndex(i => tel === i.tel)) !== -1 ||
                checkMemberInfo(mailCheck = checkInfo.findIndex(i => mail === i.email)) !== -1) {

                let nameCheck = checkInfo.findIndex(i => userName === i.userName)
                let telCheck = checkInfo.findIndex(i => tel === i.tel)
                let mailCheck = checkInfo.findIndex(i => mail === i.email)

                if (nameCheck !== -1) {
                    document.querySelector(`[data-message="變更名稱"]`).textContent = "變更的名稱與其他用戶重複，請重新輸入";
                }
                if (telCheck !== -1) {
                    document.querySelector(`[data-message="變更號碼"]`).textContent = "變更號碼與其他用戶重複，請重新輸入";
                }
                if (mailCheck !== -1) {
                    document.querySelector(`[data-message="變更mail"]`).textContent = "變更mail與其他用戶重複，請重新輸入";
                }

            }
            // 若驗證OK  寫入資料 
            else if (result === undefined && PASDCheck === false) {

                // 如果使用者沒有變更密碼，僅變更別的項目
                if (password === "") {
                    axios.patch(`http${secure}://${api_domain}/users/${localStorage.getItem("userId")}`, {
                        "userName": userName,
                        "tel": tel,
                        "email": mail,
                        "password": userInfo.checkPASD,
                        "checkPASD": userInfo.checkPASD
                    }).then(function (response) {
                        Swal.fire({
                            title: '恭喜你修改成功了✧*｡٩(ˊᗜˋ*)و✧*｡ <br /> 接著...',
                            showCancelButton: true,
                            confirmButtonText: '<a href="./memberPage.html" class="btn btn-outline-dark fs--7 font-Montserrat">返回會員首頁</a>',
                            cancelButtonText: `<span class="btn btn-outline-dark fs--7 font-Montserrat">再次修改</span>`,
                            scrollbarPadding: false,
                            heightAuto: false,
                        })
                        getUserInfo()
                    })
                        .catch(function (error) {
                            console.log(error)

                            Swal.fire({
                                title: '出現非預期的錯誤，請稍後再嘗試',
                                showConfirmButton: true,
                                confirmButtonText: '<a href="#" class="btn btn-outline-dark fs--6 font-Montserrat">確認</a>'
                            })

                        })
                } else if (password !== "") {
                    axios.patch(`http${secure}://${api_domain}/users/${localStorage.getItem("userId")}`, {
                        "userName": userName,
                        "tel": tel,
                        "email": mail,
                        "password": password,
                        "checkPASD": password
                    }).then(function (response) {
                        Swal.fire({
                            title: '恭喜你修改成功了✧*｡٩(ˊᗜˋ*)و✧*｡ <br /> 接著...',
                            showCancelButton: true,
                            confirmButtonText: '<a href="./memberPage.html" class="btn btn-outline-dark fs--7 font-Montserrat">返回會員首頁</a>',
                            cancelButtonText: `<span class="btn btn-outline-dark fs--7 font-Montserrat">再次修改</span>`,
                            scrollbarPadding: false,
                            heightAuto: false,
                        })
                        getUserInfo()
                    })
                        //  如果出現錯誤 即是出現非預期錯誤。
                        .catch(function (error) {
                            console.log(error)

                            Swal.fire({
                                title: '出現非預期的錯誤，請稍後再嘗試',
                                showConfirmButton: true,
                                confirmButtonText: '<a href="#" class="btn btn-outline-dark fs--6 font-Montserrat">確認</a>'
                            })

                        })
                }
            }
        }

    })

    cancelBtn.addEventListener("click", e => {
        renderMemberInfo()
        Swal.fire({
            title: '您已取消變更，將回到會員首頁',
            scrollbarPadding: false,
            heightAuto: false,
            showConfirmButton: false,
            confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
            timer: 2500
        })
        setTimeout("location.href='./memberPage.html'", 2600);
    })

}




// 取得會員資料
function getUserInfo() {

    axios.get(`http${secure}://${api_domain}/${Guarded_routes}users/${localStorage.getItem("userId")}`, headers)
        .then(response => {
            userInfo = response.data

            renderMemberInfo()

        }).catch(error => {
            console.log(error)
        })
}


// 確認會員資料是否與他人重複 (不能把自己算進去)
function checkMemberInfo(result) {
    return result
}


// 渲染會員資料
function renderMemberInfo() {
    changeName.setAttribute("value", userInfo.userName)
    changeTel.setAttribute("value", userInfo.tel)
    changeEmai.setAttribute("value", userInfo.email)
}