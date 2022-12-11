if (body.classList[4] === "showinfo") {
    

    let renderShow = {};

    showInfoInit()

    // 取得當前url展演資訊
    function getShowinfo() {
        let url = location.href;
        let getId = url.split("=")
        let id = getId[1];

        axios.get(`http${secure}://${api_domain}/shows?id=${id}`)
            .then(response => {
                renderShow = response.data[0];
                renderShowinfo()
            }).catch(error => {
                console.log(error);
                alert("展演詳細介紹-API資訊串接出現錯誤，請檢查console")
            })
    }

    // 渲染當前url展演資訊功能 
    function renderShowinfo() {

        let infoStr = `<li class="d-flex d-sm-block align-items-center mb-2 mb-sm-6 col-lg-12 col-sm-6 pt-6 pt-lg-0"><strong
                    class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">展出日期 :
                  </strong>
                  <p class="fs--7 fs-sm-8">${renderShow.startDate} – ${renderShow.endDate}</p>
                  </li>
                  <li class="d-flex d-sm-block align-items-center mb-2 mb-sm-6 col-lg-12 col-sm-6 pt-sm-6 pt-lg-0"><strong
                    class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">展出時段 :
                  </strong>
                  <p class="fs--7 fs-sm-8">${renderShow.startTime} - ${renderShow.endTime}</p>
                  </li>
                  <li class="d-flex d-sm-block align-items-center mb-2 mb-sm-6 col-lg-12 col-sm-6 "><strong
                    class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">展出地點 :
                  </strong>
                  <p class="fs--7 fs-sm-8">${renderShow.location}</p>
                  </li>
                  <li class="d-flex d-sm-block align-items-center mb-2 mb-sm-6 col-lg-12 col-sm-6 "><strong
                    class="fs--7 fs-sm-8 me-1 mb-0 mb-lg-2">票價 :
                  </strong>
                  <p class="fs--7 fs-sm-8">${renderShow.price}</p>
                  </li>
                  <li class="d-flex justify-content-center d-lg-block pb-2 pb-lg-0">
                  <button type="button" class="btn btn-outline-dark">加入收藏清單</button>
                  </li>`;

        let introduceStr = `<div class="mb-12">
                <h2 class="mb-4">
                ${renderShow.title}</h2>
                <hr>
                <img src="${renderShow.imgUrl}"
                    alt="展演" class="mb-4">
                <hr>
                </div>
                <div class="mb-12">
                    ${renderShow.description}
                </div>`;

        showInfoPage_info.innerHTML = infoStr;
        showInfoPage_introduce.innerHTML = introduceStr;
    }

    // showInfo頁面初始化
    function showInfoInit() {
        getShowinfo()
    }

}