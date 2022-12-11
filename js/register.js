
if (body.classList[4] === "register") {


    const registerBtn = document.querySelector(".registerBtn");
    const form = document.querySelector("form");
    const alertTab = document.querySelectorAll(".validate_constraint");
    const readRule = document.querySelector("#readRule");


    // 註冊功能POST & 表單驗證
    registerBtn.addEventListener("click", e => {

        //綁定獲取資料DOM
        let userName = document.querySelector(".name").value;
        let tel = document.querySelector(".tel").value;
        let mail = document.querySelector(".mail").value;
        let password = document.querySelector(".password").value;

        // 每次點擊註冊按鈕時，先清空所有填寫錯誤提示
        alertTab.forEach(i => { i.textContent = "" });

        // constraint >>  使用validate驗證前  建立的驗證條件
        let constraint = {
            名稱: {
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
            手機號碼: {
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
            email: {
                presence: {
                    message: "為必填"
                },
                email: {
                    message: "格式錯誤，請輸入有效email"
                }
            },
            密碼: {
                presence: {
                    message: "為必填"
                },
                length: {
                    minimum: 8,
                    message: "密碼至少8字元組合"
                },
                format: {
                    pattern: "[a-z0-9]+",
                    message: "限用英文及數字之字元組合"
                }
            },
            驗證: {
                presence: {
                    message: "為必填"
                },
                equality: {
                    attribute: "密碼",
                    message: "與第一次密碼不同，請重新輸入"
                }
            }
        }

        // 確認checkbox是否已打勾
        let readRuleCheck = readRule.checked;


        // 使用 validate 驗證表單，validate回傳物件 每個屬性下有一個陣列值
        let result = validate(form, constraint);

        //在判斷式中，任何物件只要不是 undefined 或 null ，儘管是值為false 的 Boolean 物件，都會被轉換成true。舉例來說，下列的 if 判斷式中的布林值即為true。
        if (result) {

            //透過驗證器反饋的物件屬性，先用Object.keys轉換成陣列跑forEach，並用選擇器選擇到對應的每一筆HTML標籤後，將其反饋的內容逐一塞進HTML標籤內顯示出來。
            Object.keys(result).forEach(keys => {
                document.querySelector(`[data-message="${keys}"]`).textContent = result[keys];
            })
          // checkbox 若未打勾，必須打勾。
        } else if (readRuleCheck === false) {
            document.querySelector(`[data-message="會員守則"]`).textContent = "請確認已勾選同意會員守則";

          // 若驗證OK  寫入資料 
        } else if (result === undefined && readRuleCheck === true) {

        axios.post(`http${secure}://${api_domain}/signup`, {
            "userName": userName,
            "tel": tel,
            "email": mail,
            "password": password,
        }).then(function (response) {

            console.log(response)
            Swal.fire({
                title: '恭喜你註冊成功了✧*｡٩(ˊᗜˋ*)و✧*｡ <br /> 接著...',
                showCancelButton: true,
                confirmButtonText: '<a href="./login.html" class="btn btn-outline-dark fs--7 font-Montserrat">來去登入</a>',
                cancelButtonText: `<span class="btn btn-outline-dark fs--7 font-Montserrat">我再逛逛</span>`,
                scrollbarPadding: false,
                heightAuto: false,
              })
              form.reset();
        })
        //  如果出現錯誤 即是email已註冊過，或出現非預期錯誤。
        .catch(function (error) {
            console.log(error)
            if(error.response.data === "Email already exists"){
                Swal.fire({
                    title: '此email已註冊 <br/>請登入會員或重新註冊',
                    confirmButtonText: '<a href="#" class="btn btn-outline-dark fs--6 font-Montserrat">確認</a>'
                  })
            }else{
                Swal.fire({
                    title: '出現非預期的錯誤，請稍後再嘗試',
                    showConfirmButton: true,
                    confirmButtonText: '<a href="#" class="btn btn-outline-dark fs--6 font-Montserrat">確認</a>'
                  })
            }
        })
        }
    })

}

