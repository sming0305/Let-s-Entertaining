if (body.classList[4] === "login") {


    // 獲取 form & 登入按鈕 & 警告標籤  的DOM
    const form = document.querySelector("form");
    const loginBtn = document.querySelector(".loginBtn");
    const alertTab = document.querySelectorAll(".login_validate_constraint");


    // 登入功能POST & 表單驗證
    loginBtn.addEventListener("click", e => {
        e.preventDefault();

        //獲取登入欄位資料DOM
        let loginEmail = document.querySelector(".loginEmail").value;
        let loginPassword = document.querySelector(".loginPassword").value;

        // 每次點擊註冊按鈕時，先清空所有填寫錯誤提示
        alertTab.forEach(i => { i.textContent = "" });


        // constraint >>  使用validate驗證前  建立的驗證條件
        let constraint = {
            登入信箱: {
                presence: {
                    message: "為必填"
                },
                email: {
                    message: "格式錯誤，請輸入有效email"
                }
            },
            登入密碼: {
                presence: {
                    message: "為必填"
                },
                length: {
                    minimum: 8,
                    message: "至少為8字元組合"
                },
                format: {
                    pattern: "[a-z0-9]+",
                    message: "限用英文及數字組合"
                }
            }
        }


        // 使用 validate 驗證表單
        let result = validate(form, constraint);

        //透過驗證器反饋的物件屬性，先用Object.keys轉換成陣列跑forEach，並用選擇器選擇到對應的每一筆HTML標籤後，將其反饋的內容逐一塞進HTML標籤內顯示出來。
        if (result) {
            Object.keys(result).forEach(keys => {
                document.querySelector(`[data-message="${keys}"]`).textContent = result[keys];
            })


            // 若驗證OK  寫入資料
        } else if (result === undefined) {

            axios.post(`http://${api_domain}/login`, {
                "email": loginEmail,
                "password": loginPassword
            }).then(function (response) {

                // token 存到localStroage
                localStorage.setItem("userToken", response.data.accessToken)
                localStorage.setItem("userId", response.data.user.id)
                localStorage.setItem("userName", response.data.user.userName)


                Swal.fire({
                    title: '登入成功，即將為您跳轉頁面...',
                    scrollbarPadding: false,
                    heightAuto: false,
                    timer: 2000,
                    showConfirmButton: false,
                })

                // 跳轉至會員首頁
                setTimeout("location.href='./memberPage.html'", 2000);

                form.reset();
            })
                //錯誤時相關警告
                .catch(function (error) {
                    console.log(error)
                    if (error.response.data === "Cannot find user") {
                        Swal.fire({
                            title: '查無此使用者email，請重新輸入',
                            confirmButtonText: '<a href="#" class="btn btn-outline-dark fs--6 font-Montserrat">確認</a>',
                            scrollbarPadding: false,
                            heightAuto: false,
                        })
                    } else if (error.response.data === "Incorrect password") {
                        Swal.fire({
                            title: '您的密碼有誤，請重新輸入',
                            confirmButtonText: '<a href="#" class="btn btn-outline-dark fs--6 font-Montserrat">確認</a>',
                            scrollbarPadding: false,
                            heightAuto: false,
                        })
                    } else {
                        Swal.fire({
                            title: '系統出現錯誤，請稍後再試',
                            showConfirmButton: true,
                            confirmButtonText: '<a href="#" class="btn btn-outline-dark fs--6 font-Montserrat">確認</a>',
                            scrollbarPadding: false,
                            heightAuto: false,
                        })
                    }
                })
        }

    })
}