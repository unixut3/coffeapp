import {
  saveTask, 
  updateTask, 
} from "./firebase.js";
import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL, 
  } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";
  
  const storage = getStorage();

  const taskForm = document.getElementById("task-form");
  const beenList = document.getElementById("tr-beenList");

  let editStatus = false;
  let id = "";
  let beenCnt = 10;
  var beenArr = new Array();

  class Been {
    constructor(beenNm, beenWeight, beenPrice) {
        this.beenNm = beenNm;
        this.beenWeight = beenWeight;
        this.beenPrice = beenPrice;
    }
}
  
  //onload
  window.addEventListener("load", async (e) => {
    onStart();

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
    var imageUrl = "https://blog.kakaocdn.net/dn/mNBeh/btrCEeNBGpX/4SsK6VI0VMlNAkZe83cPa1/img.jpg";
    var realCnt = 0;

    //원두 카운트
    for (let i = 0; i < beenCnt; i++) {
      var beenNm = document.getElementById('beenNm_'+ i).value;
      var beenWt = document.getElementById('beenWt_' + i).value;
      var beenPrice = document.getElementById('beenPrice_' + i).value;

      if(beenNm != "" && beenWt != "" && beenPrice != "" ){
        realCnt++;
      }
    }

    for (let i = 0; i < realCnt; i++) {
      var beenNm = document.getElementById('beenNm_'+ i).value;
      var beenWt = document.getElementById('beenWt_' + i).value;
      var beenPrice = document.getElementById('beenPrice_' + i).value;

      beenArr[i] = (new Been(beenNm, beenWt, beenPrice));
      
    }

    var ret = confirm('저장 하시겠습니까?')
    if (ret){
      try {
        if (!editStatus) {
          await saveTask(rosteryName.value, location.value, imageUrl);
        } else {
          await updateTask(id, {
            rosteryName: rosteryName.value,
            location: location.value,
            imageUrl: imageUrl
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

    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      console.log("Error : " + error);
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
    );
  });

  $('#btn-Upload').click(function(){
    
  });

 