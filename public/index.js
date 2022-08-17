
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
  
  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");
  const storage = getStorage();

  let editStatus = false;
  let id = "";
  
  window.addEventListener("DOMContentLoaded", async (e) => {
    // const querySnapshot = await getTasks();
  
    //처음 로드되면 실행
    onGetTasks((querySnapshot) => {
      tasksContainer.innerHTML = "";
      
      //doc에 있는 목록 가져오기
      querySnapshot.forEach((doc) => {
        const task = doc.data();
  
        tasksContainer.innerHTML += `
          <div class="card card-body mt-2 border-primary">
            <h3 class="h5">${task.rosteryName}</h3>
            <p>${task.location}</p>
            <image src="${task.imageUrl}" class="thumbnail"></image>
          <div>
            <button class="btn btn-primary btn-delete" data-id="${doc.id}">
              🗑 Delete
            </button>
            <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
              🖉 Edit
            </button>
          </div>
        </div>`;
      });
  
      //삭제버튼
      const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async ({ target: { dataset } }) => {
          var ret = confirm('삭제하시겠습니까?')
          if (ret){
            try {
              await deleteTask(dataset.id);
              alert('삭제완료');
            } catch (error) {
              console.log(error);
            }
          } 
        })
      );
  
      //수정버튼
      const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          try {
            const doc = await getTask(e.target.dataset.id);
            const task = doc.data();
            taskForm["task-rosteryName"].value = task.rosteryName;
            taskForm["task-location"].value = task.location;
            
            editStatus = true;
            id = doc.id;
            taskForm["btn-task-form"].innerText = "Update";
            taskForm["btn-cancel-form"].style = "display";
            alert('수정완료');
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  });
  
  //저장버튼 버튼 이벤트
  taskForm.addEventListener("submit", async (e) => {
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
        rosteryName.focus();
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
    (snapshot) => {debugger
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

  