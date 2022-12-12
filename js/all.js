const body = document.querySelector("body");
const main = document.querySelector("main");
const header = document.querySelector("header");
const offcanvas = document.querySelector(".offcanvas");
const mobile__Menu = document.querySelector(".mobile__Menu");
const lazy_loaded = document.querySelector(".lazy-loaded");
const mask_1 = document.querySelector(".mask__1");
const mask_2 = document.querySelector(".mask__2");
const mask_3 = document.querySelector(".mask__3");
const mask_4 = document.querySelector(".mask__4");

const indexShowList = document.querySelector(".indexShowList");
const fullShowList = document.querySelector(".fullShowList");
const showInfoPage_info = document.querySelector(".showinfo_info");
const showInfoPage_introduce = document.querySelector(".showintroduce");
const member_notice = document.querySelector(".member_notice");
const member_location = document.querySelector(".member-location");
const member_date = document.querySelector(".member-date");
const member_showList = document.querySelector(".member_showList");
const logout_btn = document.querySelectorAll(".logout-btn");
const member_btn = document.querySelectorAll(".member-btn");

console.log("PUSH前記得更改secure & domain路徑")

// 切換secure
let secure = "";
// Json-Server網址domain路徑
let api_domain = "localhost:3000"; // entertaining.vercel.app
// Json-server-auth 開啟部分功能需驗證Token (若不使用則填空字串);
let Guarded_routes = "600/"
// 使用者headers Token 暫存處
let headers = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("userToken")}`
  }
}


// 判斷使用者當前點擊到欲收藏的活動Id---儲存位置
let showId = ``;
// 判斷使用者當前點擊到欲收藏的活動是否已收藏代號---儲存位置
let showExist = ``;
// tokenOverTime 資訊暫存
let tokenOverTime = ``;
// 取得今天日期，並使格式與資料庫展演日期格式一致
let day = new Date()
let today = `${day.getFullYear()}/${String(day.getMonth() + 1).padStart(2, '0')}/${String(day.getDate()).padStart(2, '0')}`
// 展演結束日期gap暫存處;
let gap = ``;

// 初始化
Init();


let data = [];

// 取得所有展覽演出活動資訊
function getShowList() {

  axios.get(`http${secure}://${api_domain}/shows`)
    .then(function (response) {
      data = response.data;

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

      // 渲染展演列表
      renderShowList()
    }).catch(function (error) {
      console.log(error);
      alert("全部展演清單API資訊串接出現錯誤，請檢查console")
    })
}

// 渲染展演列表功能 (首頁-展演列表 & 全部展演頁-列表)
function renderShowList(dataBase) {

  //若當前位於首頁，渲染 首頁-展演列表
  if (body.classList[4] === "index") {
    let str = "";
    data.slice(0, 3).forEach(i => {
      str += `<li class="card mb-7 col-12 col-sm-10 offset-sm-1 col-xl-8 offset-xl-2 bg-transparent">
               <div class="row g-0">
                   <div class="col-lg-5">
                       <img src="${i.imgUrl}"
                           class="img-fluid rounded-start rounded-2 mb-4 mb-lg-0" alt="Off Menu 2022">
                   </div>
                   <div class="col-lg-7 text-white">
                       <div
                           class="card-body px-0 py-0 ps-lg-4 py-lg-2 d-flex flex-column justify-content-between h-100">
                           <div class="mb-2 mb-sm-6 mb-lg-3">
                               <h5 class="card-title fw-normal font-Montserrat fs--8 fs-sm-10 textLineOverflow">${i.title}</h5>
                               <p class="card-text text-muted mb-2 fs--7 fs-sm-8">${i.startDate} – ${i.endDate}</p>
                               <div class="d-none d-sm-block">
                                   <p class="card-text textLineOverflow2 text-info">${i.introduce}</p>
                               </div>
                           </div>
                           <div class="d-sm-flex justify-content-sm-end">
                               <a href="./showinfo.html?id=${i.id}"
                                   class="btn btn-outline-info me-1 me-sm-2 font-Montserrat active-white fs--7 fs-sm-8 px-2 px-sm-6" target="_new">詳細介紹</a>
                               <a href="#"
                                   class="btn btn-outline-info font-Montserrat active-white fs--7 fs-sm-8 px-2 px-sm-6" data-show-id="${i.id}">加入收藏清單</a>
                           </div>
                       </div>
                   </div>
                </div>
               </li>`
    })
    indexShowList.innerHTML = str;

  }

  //若當前位於全部展演頁，渲染 全部展演頁-列表
  if (body.classList[4] === "showlist") {
    let str = "";
    data.forEach(i => {
      str += `<li class="mb-3 col-12 offset-xl-1 col-xl-10 mb-4">
              <div class="card  border-bottom border-black bg-transparent" style="min-height: 80px;">
                  <div class="row g-0">
                      <div class="col-4 col-lg-3 col-xxl-2">
                          <a href="./showinfo.html?id=${i.id}"><img src="${i.imgUrl}"
                              class="img-fluid img--size1" alt="展演"></a>
                      </div>
                      <div class="col-8 col-lg-9 col-xxl-10">
                          <div class="card-body p-1 p-sm-2 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between h-100">
                              <div>
                                  <a href="./showinfo.html?id=${i.id}"><h5 class="fs--7 fs-sm-8 fs-lg-12 textLineOverflow">${i.title}</h5></a>
                                  <p class="card-text fs--6 fs-sm-8">${i.startDate} – ${i.endDate}</p>
                                  <p class="card-text d-none d-lg-block"><small>${i.startTime} - ${i.endTime}</small> <small>${i.locationName}</small></p>
                              </div>
                              <div class="d-flex justify-content-end flex-shrink-0">
                                  <a href="./showinfo.html?id=${i.id}" class="btn btn-sm fs-7 fs-sm-8 d-none d-xs-block me-2 btn-outline-dark" target="_new">詳細介紹</a>
                                  <a href="#" class="btn btn-sm fs-7 fs-sm-8 btn-outline-dark" data-show-id="${i.id}">加入收藏清單</a>
                              </div>
                          </div>
                      </div>
                  </div>
                 </div>
               </li>`
    })
    fullShowList.innerHTML = str;
  }

}

// 收藏活動前，判斷使用者是否已加入會員 & 收藏活動
function memberOrNot() {

  // 若沒有userToken  跳出提示
  if (localStorage.getItem("userToken") === null) {
    Swal.fire({
      title: '加入會員，即可收藏喜歡的展演活動',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '<a href="./login.html" class="btn btn-outline-dark fs--7 font-Montserrat">登入</a>',
      denyButtonText: `<a href="./register.html" class="btn btn-outline-dark fs--7 font-Montserrat">註冊</a>`,
      cancelButtonText: `<span class="btn btn-outline-dark fs--7 font-Montserrat">稍後決定</span>`,
      scrollbarPadding: false,
      heightAuto: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
    //若有 userToken 則執行
  } else if (localStorage.getItem("userToken") !== null) {

    // 判斷活動是否已被收藏過，若是則跳出提醒，否則收藏
    favoriteShowExist()
  }
}

// 判斷活動是否已被收藏過
function favoriteShowExist() {

  axios.get(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList?userId=${localStorage.getItem("userId")}`, headers)
    .then(response => {

      showExist = response.data.findIndex(i => i.showId === showId)

      // 若是則跳出提醒
      if (showExist !== -1) {
        Swal.fire({
          title: '此活動您已收藏過囉~',
          scrollbarPadding: false,
          heightAuto: false,
          showConfirmButton: false,
          confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
          timer: 2500
        })
      }
      // 若否則收藏活動
      else {
        addFavorite()
      }
    }).catch(error => {
      console.log(error);
      tokenOverTime = error.response.request.statusText;
      if (tokenOverTime === "Unauthorized") {
        overtime();
      } else if (tokenOverTime === "Forbidden") {
        // 在收藏清單為0筆的狀況下做get檢查會進到這個錯誤，代表0筆，將直接進行收藏。
        addFavorite()
      }
      else {
        alert("登入資訊環節異常，請檢查console");
      }
    })
}

// 將使用者按喜歡的活動收藏至資料庫
function addFavorite() {

  axios.post(`http${secure}://${api_domain}/${Guarded_routes}showFavoriteList`,
    {
      "userId": `${localStorage.getItem("userId")}`,
      "showId": showId,
    }, headers)
    .then(response => {
      console.log(response)
      Swal.fire({
        title: '收藏成功~，可至會員中心展演閘查看',
        scrollbarPadding: false,
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: `<button class="btn btn-outline-dark fs--7 font-Montserrat">OK</button>`,
      })
    })
    .catch(error => {
      console.log(error);
      tokenOverTime = error.response.request.statusText;
      //  若Token過期 or 使用者登入資訊錯誤時，當使用者觸發需token權限功能，將使用者登出並提醒重新登入
      if (tokenOverTime === "Unauthorized") {
        overtime();
      }
      else {
        alert("登入資訊環節異常，請檢查console");
      }
    })
}

// 登入 & 登出 狀態檢查復位  &  導覽列狀態切換檢查
function userLoginInfo() {

  // 當localStorage 存在userToken & userId & userName情況下，表示登入中，導覽列顯示為登入狀態。
  if (localStorage.getItem("userToken") !== null && localStorage.getItem("userId") !== null && localStorage.getItem("userName") !== null) {

    // 導覽列顯示為登入狀態
    logout_btn.forEach(i => {
      i.classList.remove("d-none");

      // 將會員專區文字改為歡迎會員名稱
      member_btn.forEach(i => {
        i.textContent = `Hi!  ${localStorage.getItem("userName")}`;
        i.setAttribute("href", `./memberPage.html`)
      })

      // 若使用者點擊登出，將使用者登出 & 清空localStorage資料 & 復原導覽列狀態
      i.addEventListener("click", e => {

        logout_btn.forEach(i => {
          i.classList.add("d-none")
        })

        member_btn.forEach(i => {
          i.textContent = "會員專區";
          i.setAttribute("href", `./login.html`)
        })

        localStorage.removeItem("userToken")
        localStorage.removeItem("userId")
        localStorage.removeItem("userName")

        Swal.fire({
          title: '登出成功~(´≖◞౪◟≖)',
          scrollbarPadding: false,
          heightAuto: false,
          showConfirmButton: false,
          timer: 1800
        })
        setTimeout("location.href='./index.html'", 1800);
      })
    })
  }

  // 若使用非常規方式直接出現在memberPage 且登入者資料不齊全，將其登出引導回登入頁面
  if (body.classList[4] === "reviseinfo" || body.classList[4] === "memberPage" || body.classList[4] === "memberPage-showlist" || body.classList[4] === "memberPage-showassistant") {
    if (localStorage.getItem("userToken") === null || localStorage.getItem("userId") === null || localStorage.getItem("userName") === null) {
      Swal.fire({
        title: '你是怎麼進來的~(´≖◞౪◟≖)<br />將替您登出<br/>如有需要請重新登入會員',
        scrollbarPadding: false,
        heightAuto: false,
        showConfirmButton: false,
      })

      localStorage.removeItem("userToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")

      logout_btn.forEach(i => {
        i.classList.add("d-none");
      })

      member_btn.forEach(i => {
        i.textContent = "會員專區";
        i.setAttribute("href", `./login.html`)
      })
      setTimeout("location.href='./login.html'", 3000);

    }
  } // 使用者登入資訊出現不齊全狀況時，將使用者登出並提示請重新登入
  else if (localStorage.getItem("userToken") === null || localStorage.getItem("userId") === null || localStorage.getItem("userName") === null) {
    if (localStorage.getItem("userToken") !== null || localStorage.getItem("userId") !== null || localStorage.getItem("userName") !== null) {
      Swal.fire({
        title: '登入資訊異常，將清除異常<br/>如有需要請重新登入會員',
        scrollbarPadding: false,
        heightAuto: false,
        showConfirmButton: false,
      })

      localStorage.removeItem("userToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")

      logout_btn.forEach(i => {
        i.classList.add("d-none");
      })

      member_btn.forEach(i => {
        i.textContent = "會員專區";
        i.setAttribute("href", `./login.html`)
      })
      setTimeout("location.href='./login.html'", 3000);
    }
  }
}

// Token過期時，當使用者觸發需token權限功能時，將使用者登出並提醒重新登入
function overtime() {


  Swal.fire({
    title: '登入驗證已逾期，將替您登出<br/>請重新登入會員',
    scrollbarPadding: false,
    heightAuto: false,
    showConfirmButton: false,
  })

  localStorage.removeItem("userToken")
  localStorage.removeItem("userId")
  localStorage.removeItem("userName")

  logout_btn.forEach(i => {
    i.classList.add("d-none");
  })

  member_btn.forEach(i => {
    i.textContent = "會員專區";
    i.setAttribute("href", `./login.html`)
  })

  setTimeout("location.href='./login.html'", 3000);

}

//初始化function
function Init() {
  gsap.registerPlugin(ScrollTrigger)
  AOS.init({ offset: 350 }); // offset (in px) from the original trigger point
  getShowList()
  userLoginInfo()
}




























// -------------------------- 當處於首頁時執行以下 --------------------------
if (body.classList[4] === "index") {

  // 偵測首頁 使用者點擊將活動加入收藏時
  indexShowList.addEventListener("click", e => {


    if (e.target.textContent === "加入收藏清單") {
      e.preventDefault();

      // 取得showId
      showId = e.target.getAttribute("data-show-id");

      // 收藏活動前，判斷使用者是否已加入會員 & 收藏活動
      memberOrNot()

    }
  })


  //首頁不顯示nav下方border線
  header.classList.remove("border-bottom")

  // banner 字體底線閃爍 動畫效果
  gsap.to(".flashing--bottomline", { opacity: 0, duration: 1, repeat: -1 })

  // 首頁 .lazy-loaded的scale 動畫效果
  const scale = gsap.timeline({
    scrollTrigger: {
      trigger: ".lazy-loaded-box", // 決定scrolltrigger要以哪一個元素作為觸發基準點
      start: 'top 47%', // 決定動畫開始點的位置
      end: 'top 0%', // 決定動畫結束點的位置
      scrub: true, //開啟scrub決定動畫播放是否依賴視窗滾動
    },
  })
  scale.to(".lazy-loaded", { scale: 1.3, duration: 10 })

  // 首頁最下方園區簡介 動畫效果
  const mask = gsap.timeline({
    scrollTrigger: {
      trigger: ".section--mask",
      start: 'top 80%',
    },
  })
  if (window.innerWidth >= 768) {
    mask.to(".mask__1", { opacity: 0, duration: 2 });
    mask.to(".mask__3", { opacity: 1, duration: 3 });
    mask.to(".mask__3", { opacity: 1, duration: 3 });
    mask.to(".mask__3", { opacity: 0, duration: 1.5 });
    mask.to(".mask__2", { opacity: 0, duration: 1 });
    mask.to(".mask__1", { opacity: 0.9, duration: 1 });
    mask.to(".mask__4", { opacity: 1, duration: 3 });
    mask.to(".mask__4", { opacity: 1, duration: 3 });
    mask.to(".mask__4", { opacity: 0, duration: 1.5 });
    mask.to(".mask__2", { opacity: 0.9, duration: 1 });
    mask.to(".mask__1", { xPercent: "-100", duration: 2 });
    mask.to(".mask__2", { xPercent: "100", duration: 2 }, "<");
    mask.to(".mask__1", { opacity: 0, duration: 0.5 });
    mask.to(".mask__2", { opacity: 0, duration: 0.5 }, "<");
    mask.to(".mask__1", { xPercent: "0", duration: 0.5 });
    mask.to(".mask__2", { xPercent: "0", duration: 0.5 }, "<");

    mask_3.addEventListener("mouseover", e => {

      if (mask_2.getAttribute("style") === "opacity: 0; translate: none; rotate: none; scale: none; transform: translate(0px, 0px);") {
        mask_2.classList.add("hover");
        mask_3.classList.add("hover");
      }
    })
    mask_4.addEventListener("mouseover", e => {
      if (mask_1.getAttribute("style") === "opacity: 0; translate: none; rotate: none; scale: none; transform: translate(0px, 0px);") {
        mask_1.classList.add("hover");
        mask_4.classList.add("hover");
      }
    })
  }

  // mobile 狀態下去除漢堡選單啟動時右側padding & 點擊 offcanvas_backdrop後 mobile__Menu正確顯示
  mobile__Menu.addEventListener("click", function (e) {
    mobile__Menu.classList.toggle("open");
    body.setAttribute("style", "");
    header.setAttribute("style", "");

    const offcanvas_backdrop = document.querySelector(".offcanvas-backdrop");

    // 點擊 offcanvas_backdrop 關閉 mobile選單時，移除漢堡選單open (保持正確復位)
    offcanvas_backdrop.addEventListener("click", e => {
      mobile__Menu.classList.remove("open");
    })
  })

  // 監聽螢幕左右縮放，確保漢堡選單及offcanvas_backdrop正確隱藏及顯示
  window.addEventListener("resize", function (e) {
    const offcanvas_backdrop = document.querySelector(".offcanvas-backdrop");

    if (offcanvas_backdrop !== null) {
      if (e.target.innerWidth >= 992) {
        offcanvas.classList.add("d-none");
        offcanvas_backdrop.classList.add("d-none");
      } else {
        offcanvas.classList.remove("d-none");
        offcanvas_backdrop.classList.remove("d-none");
      }
    }
  })
}



