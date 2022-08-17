import {
  onGetTasks, 
  saveTask, 
  deleteTask, 
  getTask, 
  updateTask, 
  getTasks,
} from "./firebase.js";
import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL, 
  } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";
  
  const storage = getStorage();

  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");

  let editStatus = false;
  let id = "";
  var beenCnt = 1;
  
    
  //저장버튼 버튼 이벤트
  const saveBtn = document.getElementById("btn-task-form");
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    const rosteryName = taskForm["task-rosteryName"];
    const location = taskForm["task-location"];
    var imageUrl = "https://blog.kakaocdn.net/dn/mNBeh/btrCEeNBGpX/4SsK6VI0VMlNAkZe83cPa1/img.jpg";

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
  $('#btn-Upload').click(function(){
    const metadata = {
      contentType: 'image/jpeg'
    };
    const file = document.querySelector('#image').files[0];
    if(file == null){
      alert("선택된  파일이 없습니다.");
      return;
    }

    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
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
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {debugger
        console.log('File available at', downloadURL);
      });
    }
    );
  });

  //증감버튼
  $('#btn-plus').click(function(){
    beenCnt++;
    document.getElementById('beenCnt').innerText = beenCnt;
  });

  $('#btn-minus').click(function(){
    if(beenCnt != 0){
      beenCnt--;
    } else {
      beenCnt = 0
    }
    document.getElementById('beenCnt').innerText = beenCnt;
  });