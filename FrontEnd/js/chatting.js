const sendButton = document.querySelector('.chat-send-botton');
// 로그인 정보 가져와서 isloginUserId
const isloginUserId = 1;
sendButton.addEventListener('click', async () => {
  const chatInput = document.querySelector('#chatId');
  const message = chatInput.value;
  const receiver =  user_id;
  const isRead = 0;

  // 서버로 채팅 데이터 전송
  console.log({ user_id : isloginUserId, message,receiver,isRead });
    // 요청 보내면 body객체 안에 { data: { user_id : isloginUserId, message,receiver,isRead } } 이렇게 전달된다.
  await axios.post('http://127.0.0.1:8080/chat/create', { data: { user_id : isloginUserId, message,receiver,isRead } });
// user_id는 1로 넣어놨지만 로그인한 유저의 아이디를 넣어주면 된다.


  // 입력 필드 초기화
  chatInput.value = '';
});

const getUsers = async () => {
  const { data } = await axios.get('/chat/Users');
  const popupContent = document.querySelector('.popup-content');
  data.forEach((e, index) => {
    // return은 함수 실행중 return 문을 만나면 return 문 뒤에 쓴 값을 반환한다.
    if(e.id == 1 ) return 
    const div = document.createElement('div');
    const div2 = document.createElement('div');
    const img = document.createElement('img');
    const p = document.createElement('p');
    div.className = 'imgsize';
    img.src =
      'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTExMDFfMjkx%2FMDAxNjM1NzcyNTAyMzM2.cJE1tVC6KDvRbLggbBVEvvTt44ThhLU0wXelkyRh_bgg.ogMtpmeg-v7VIqtsSBpxHCNzt--aP7oHwL3PVm2RgiQg.JPEG.yunalee1997%2F4cc82b04dee244c22d13aee91e4b5e58.jpg&type=sc960_832';
    p.onclick = () => {
      chattingroom(index + 1);
    };
    p.innerHTML = e.nickname;
    div2.className = 'border-bottom';
    div.append(img, p);
    popupContent.append(div, div2);
  });
};

getUsers();

sendButton.addEventListener('click', () => {
  const input = document.getElementById('chatId');
  const message = input.value;

  // HTML에 채팅 내용 추가
  const chatMessages = document.getElementById('chatMessages');
  const p = document.createElement('p');
  p.textContent = message;
  chatMessages.appendChild(p);});

  sendButton.addEventListener('click', () => {
    const input = document.getElementById('chatId');
    const message = input.value;
  
    // 채팅 영역 스크롤 제어
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
   
  
  

  changeHeaderUtil()
