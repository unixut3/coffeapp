import {
    onGetTasks, 
    deleteTask, 
    getTask, 
  } from "./firebase.js";
  
  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");

  let editStatus = false;
  let id = "";
  
  window.addEventListener("load", async (e) => {
  
    //처음 로드되면 실행
    onGetTasks((querySnapshot) => {
      tasksContainer.innerHTML = "";
      
      //doc에 있는 목록 가져오기
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        var tableHTML = "";
        var cnt = task.beenList == null ? 0 : task.beenList.length;

        for (let i = 0; i < cnt; i++) {
          tableHTML += `
          <tr>
            <td>${task.beenList[i].name}</td>
            <td style="text-align: right;">${task.beenList[i].weight}</td>
            <td style="text-align: right;">${task.beenList[i].price}</td>
          </tr>
          `
        }
  
        tasksContainer.innerHTML += `
          <div class="card card-body mt-2 border-primary">
          <table>
            <tr style="text-align: left; vertical-align: top;">
              <td width="200px;">
                <image src="${task.imageUrl}" class="thumbnail"></image>
              </td>
              <td width="250px;">
                <h3 class="h5">로스터리명 : ${task.rosteryName}</h3>
                <p>위치 : ${task.location}</p>
                <p>인스타 : ${task.instaId}</p>
                <p>스토어 : ${task.store}</p>
                <p>이달의원두 여부 : ${task.monthlyYn}</p>
                <p>설명 : ${task.description}</p>
              </td>
              <td width="300px;">
                <h3 class="h5" style="text-align: center;">원두목록</h3>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th style = "width:200px; text-align: center;">원두명</th>
                        <th style = "width:100px; text-align: center;">그람</th>
                        <th style = "width:100px; text-align: center;">가격</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${tableHTML}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </table>
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
            id = e.target.dataset.id;
  
            window.location.href = "/public/upload.html?id=" + id;
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  });
  