
window.onload = ()=>{
    const post_id = window.location.search
    // 게시글 상세조회
    axios.get(`http://127.0.0.1:8080/freeboards/postdetail${post_id}`)
    .then((res)=>{
        const data = res.data;
        title.textContent = res.data.title
        nickname.textContent = res.data.User.nickname
        createdAt.textContent = res.data.createdAt.slice(0,10);
        views.textContent = res.data.views
        content.textContent = res.data.content
        likeBtn.innerHTML = `<img src="./img/like_empty.png" alt="">${res.data.FreeBoardLikes.length}`
    })
    .catch((err)=>{
        console.log(err);
    })

    // 게시글 조회수 증가
    axios.get(`http://127.0.0.1:8080/freeboards/viewsup${post_id}`)
    .then((res)=>{
    })
    .catch((err)=>{
        console.log(err);
    })
    // 로그인시 헤더 변경
    axios.get('http://127.0.0.1:8080/login/view',{withCredentials : true})
    .then((res)=>{
      if(res.data){
        headerUtilLogin.textContent = `${res.data}님`
        headerUtilSignUp.innerHTML ='<a  href="http://127.0.0.1:5500/FrontEnd/freeboard/freeboard.html" style="text-decoration: none; color: inherit;">게시판</a>'
      }
    })
    .catch((error)=>{
      console.log(error);
    })
  
    //댓글, 대댓글 조회
  axios.get(`http://127.0.0.1:8080/freeboards/comment${post_id}`)
  .then((res)=>{
    let list = res.data;
    console.log(list);
    //onload시 axios로 받아와서 뿌려준다 

    for(let i = 0; i<list.length; i++){
      let cmt = list[i];
      commentList.innerHTML +=
      `
      <div class="comment">
        <div class="commentContent">
          ${cmt.content}
        </div>
        <a class="report" href=""> <img src="./img/siren.png" alt="">신고</a>
        <div class="nick-date">
          <span class="commentNickname">${cmt.User.nickname}</span>
          <span class="commentCreatedAt">${cmt.createdAt.slice(0,10)}</span>
        </div>
        
        <div class="recomment">
          <img class="arrow" src="./img/arrow.png" alt="대댓글 화살표">
          <div class="recommentContent">
          ${
            cmt.Recomments.map(
              (recomment) => `
                <div class="recomment">
                  <div class="recommentContent">${recomment.content}</div>
                  <a class="report" href=""><img src="./img/siren.png" alt="">신고</a>
                  <div class="nick-date">
                    <span class="recommentNickname">${recomment.User.nickname}</span>
                    <span class="recommentCreatedAt">${recomment.createdAt.slice(0, 10)}</span>
                  </div>
                </div>
              `
            ).join('')
          }
          </div>
              <div class="nick-date">
              <span class="recommentNickname"></span>
              <span class="recommentCreatedAt"></span>
          </div>
        </div>
        <details>
          <summary>대댓글 달기</summary>
          
          <form class="recommentForm" action="">
              <textarea class="recommentContent" name="content" cols="30" rows="10"></textarea>
              <button class="btn">대댓글등록</button>
          </form>
        </details>
      </div>
      <div class="line"></div>
      `
    }
  })
  .catch((err)=>{
    console.log(err);
  })
  
  // 댓글등록 주소설정
  commentForm.action = `http://127.0.0.1:8080/freeboards/commentinsert${post_id}`
  
}

// 게시글 수정
updateBtn.onclick = ()=>{
    //if() // 작성자와 로그인한 아이디가 같으면
    // isLogin 이랑 ViewUser로 로그인한 데이터 가져오면 그 이름 을 이용하자
    // 수정페이지로 이동

    // 수정 페이지에서는 form으로 데이터베이스 변경, 게시글 상세 페이지 redirect
    let userNick =headerUtilLogin.textContent.slice(0,-1);

    if(userNick === nickname.textContent){
    const post_id = window.location.search

    window.location.href = `http://127.0.0.1:5500/FrontEnd/freeboard/freeboardUpdate.html${post_id}`;

    }
}

// 게시글 삭제
deleteBtn.onclick = ()=>{
  let userNick =headerUtilLogin.textContent.slice(0,-1);
  if(userNick === nickname.textContent){
    const post_id = window.location.search
    axios.get(`http://127.0.0.1:8080/freeboards/deletepost${post_id}`)
    .then((res)=>{
      window.location.href = 'http://127.0.0.1:5500/FrontEnd/freeboard/freeboard.html';
    })
    .catch((err)=>{
      console.log(err);
    })
  }

}

// 좋아요 버튼 구현
likeBtn.onclick = ()=>{
  let post_id = window.location.search;
  axios.get(`http://127.0.0.1:8080/freeboards/thumbsup${post_id}`,{withCredentials : true })
  .then((res)=>{
    // console.log(res.data);
    likeBtn.innerHTML = `<img src="./img/like_empty.png" alt="">${res.data.FreeBoardLikes.length}`
  })
  .catch((err)=>{
    console.log(err);
  })
}

// 댓글, 대댓글



