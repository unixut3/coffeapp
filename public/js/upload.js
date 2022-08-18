import {
  saveTask, 
  updateTask, 
  uploadImage,
  getTask
} from "./firebase.js";

  const taskForm = document.getElementById("task-form");
  const beenList = document.getElementById("tr-beenList");

  let editStatus = false;
  let id = "";
  let beenCnt = 10;
  var beenArr = new Array();
  
  //onload
  window.addEventListener("load", async (e) => {
    //상태확인
    if(e.delegateTarget.location.search.split('=')[1] != null){
      //수정
      if(e.delegateTarget.location.search.indexOf('?id=') != -1){
        id = e.delegateTarget.location.search.split('=')[1];
        editStatus = true; 
        
        const doc = await getTask(id);
        const task = doc.data();
        var tableHTML = "";
        
        taskForm["task-rosteryName"].value = task.rosteryName;
        taskForm["task-location"].value = task.location;
        taskForm["task-instaId"].value = task.instaId;
        taskForm["task-store"].value = task.store;
        taskForm["task-monthly"].value = task.monthly;
        taskForm["task-description"].value = task.description;

        var cnt = task.beenList == null ? 0 : task.beenList.length;
        var cnt2 = beenCnt - cnt;

        for (let i = 0; i < cnt; i++) {
          tableHTML += `
          <tr>
            <td><input type="text" name="beenNm" id="beenNm_${i}" value="${task.beenList[i].name}"></td>
            <td><input type="text" name="beenWt" id="beenWt_${i}" value="${task.beenList[i].weight}"></td>
            <td><input type="text" name="beenPrice" id="beenPrice_${i}" value="${task.beenList[i].price}"></td>
          </tr>
          `
        }
        for (let i = cnt; i < beenCnt; i++) {
          tableHTML += `
          <tr>
            <td><input type="text" name="beenNm" id="beenNm_${i}" placeholder="원두이름"></td>
            <td><input type="text" name="beenWt" id="beenWt_${i}" placeholder="무게"></td>
            <td><input type="text" name="beenPrice" id="beenPrice_${i}" placeholder="가격"></td>
          </tr>
          `
        }
        beenList.innerHTML += tableHTML;
        taskForm["btn-task-form"].innerText = "Update";
        taskForm["btn-cancel-form"].style = "display";

      } else {
        onStart();
      }
    } else {
      //신규
      onStart();
    }
  
  });

  function onStart() {
    beenList.innerHTML = "";

      for (let i = 0; i < beenCnt; i++) {
        beenList.innerHTML += `
        <tr>      
          <td><input type="text" name="beenNm" id="beenNm_${i}" placeholder="원두이름"></td>
          <td><input type="text" name="beenWt" id="beenWt_${i}" placeholder="무게"></td>
          <td><input type="text" name="beenPrice" id="beenPrice_${i}" placeholder="가격"></td>
        </tr>
        `
      }
  }
    
  //저장버튼 버튼 이벤트
  const saveBtn = document.getElementById("btn-task-form");
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    const rosteryName = taskForm["task-rosteryName"];
    const location = taskForm["task-location"];
    const instaId = taskForm["task-instaId"];
    const store = taskForm["task-store"];
    const monthlyYn = taskForm["task-monthly"];
    const description = taskForm["task-description"];
    var beenNm = "";
    var beenWt = "";
    var beenPrice = "";

    var imageUrl = "https://blog.kakaocdn.net/dn/mNBeh/btrCEeNBGpX/4SsK6VI0VMlNAkZe83cPa1/img.jpg";
    var realCnt = 0;
    
    //원두 카운트
    for (let i = 0; i < beenCnt; i++) {
      beenNm = document.getElementById('beenNm_'+ i).value;
      beenWt = document.getElementById('beenWt_' + i).value;
      beenPrice = document.getElementById('beenPrice_' + i).value;

      if(beenNm != "" && beenWt != "" && beenPrice != "" ){
        realCnt++;
      }
    }
    
    for (let i = 0; i < realCnt; i++) {
      beenNm = document.getElementById('beenNm_'+ i).value;
      beenWt = document.getElementById('beenWt_' + i).value;
      beenPrice = document.getElementById('beenPrice_' + i).value;

      beenArr[i] = {"name" : beenNm, "weight" : beenWt, "price" : beenPrice};
    }
    
    var ret = confirm('저장 하시겠습니까?')
    if (ret){
      try {
        if (!editStatus) {
          await saveTask(rosteryName.value, location.value, imageUrl, beenArr, monthlyYn.value, description.value, instaId.value, store.value);
        } else {
          await updateTask(id, {
            rosteryName: rosteryName.value,
            location: location.value,
            imageUrl: imageUrl,
            beenList: beenArr,
            monthlyYn : monthlyYn.value,
            description : description.value,
            instaId : instaId.value,
            store : store.value
          });
    
          editStatus = false;
          id = "";
          taskForm["btn-task-form"].innerText = "Save";
          taskForm["btn-cancel-form"].style = "display:none";
        }
    
        taskForm.reset();
        window.location.href = "/public/index.html";
        alert('저장완료');
      } catch (error) {
        console.log(error);
      }
    }
  });

  //취소버튼 클릭
  $('#btn-cancel-form').click(function(){
    location.reload();
  });

  //업로드 버튼 클릭
  const uploadBtn = document.getElementById("btn-upload");
  uploadBtn.addEventListener("click", async (e) => {

    const file = document.querySelector('#image').files[0];

    if(file == null){
      alert("선택된  파일이 없습니다.");
      return;
    }
    try {
      await uploadImage(file);
    } catch (error) {
      console.log(error);
    }
  });
