const socketIO = require("socket.io");
const { Sheet, Show, ReservedList } = require("../models");

// getSeatsInfo : reservation_num로 현재 좌석 정보 반환
// error : 오류

let seatArr = {};

const initReservationSocket = (server) => {
    const io = socketIO(server);

    io.on("connection", async (socket) => {
        console.log("새로운 클라이언트 접속");
        // await Sheet.create({reservation_num : "0607", sheets_array: "[[0,0,0], [0,0,0]]", show_id : 1});

        //  예매번호 room 생성 소켓 join
        socket.on("joinReservation", async (data) => {
            try {
                const { show_id, reservation_num } = data;
                socket.join(reservation_num);

                // await Sheet.update({sheets_array:JSON.stringify([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])}, {where:{show_id}});

                let seats = await Sheet.findOne({ where: { reservation_num } });
                // 문자열을 배열로 변환.
                seatArr[reservation_num] = JSON.parse(seats.dataValues.sheets_array);


                console.log("sjhdfjkshdjfkhsdjkfhsjkdfhksj", seatArr[reservation_num]);

                const show = await Show.findOne({where : {id:show_id}});
                // seatArr[reservation_num] = seats;

                // 좌석 정보, 공연 정보 반환
                socket.emit("joinReservation", { show, seats: seatArr[reservation_num] });

            } catch (error) {
                console.log(error);
                socket.emit("error", { message: "joinReservation 에러 발생", error });
            }

        });

        // 좌석 배열 요청할때
        socket.on("getSeatsInfo", (data) => {
            try {
                const { reservation_num } = data;
                socket.emit("getSeatsInfo", { seats: seatArr[reservation_num] });

            } catch (error) {
                console.log(error);
                socket.emit("error", { message: "getSeatsInfo 에러 발생", error });
            }
        });

        // 해당 좌석이 결제되었는지 여부(좌석 클릭했을때)
        socket.on("getSeat", (data) => {
            try {
                // 해당 좌석이 결제되었는지
                let pay;

                // x: 좌석의 행, y : 좌석의 열
                const { x, y, reservation_num } = data;
                if (seatArr[reservation_num][x][y]==0) {
                    // 결제 안 됨
                    pay = false;
                } else {
                    // 결제됨
                    pay = true;
                }
                socket.emit("getSeat", { pay, seats: seatArr[reservation_num], x, y });

            } catch (error) {
                console.log(error);
                socket.emit("error", { message: "getSeat 에러 발생", error });
            }
        });



        // 결제 요청
        socket.on("payment", (data) => {
            try {
                // x: 좌석의 행, y : 좌석의 열
                const { x, y, reservation_num, show_id, user_id } = data;

                // 해당 좌석 결제처리
                if (seatArr[reservation_num][x][y] == 0) {
                    seatArr[reservation_num][x][y] = 1;
                } else {
                    const pay = true;
                    // 이미 결제된 좌석이라면
                    socket.emit("getSeat", { pay, seats: seatArr[reservation_num], x, y });
                    socket.emit("payment", { result : false, message : "결제 실패"});
                    return;
                }
                // 임의로 seat_num 설정
                const seat_num = JSON.stringify([x,y]);
                Sheet.update({ sheets_array: JSON.stringify(seatArr[reservation_num]) }, { where: { reservation_num } });
                // 유저가 예매했다고 예매내역 추가
                ReservedList.create({ reservation_num, seat_num, show_id, user_id});

                // 좌석 정보 반환
                io.sockets.in(reservation_num).emit("getSeatsInfo",{ seats: seatArr[reservation_num]});
                socket.emit("getSeatsInfo",{ seats: seatArr[reservation_num]});

                socket.emit("payment", { result :true, message : "결제 완료"});

            } catch (error) {
                console.log(error);
                socket.emit("error", { message: "payment 에러 발생", error });
            }
        })


        // 결제 취소 만약 결제하다가 오류나면
        socket.on("paymentReset", (data) => {
            try {
                // x: 좌석의 행, y : 좌석의 열
                const { x, y, reservation_num, show_id, user_id } = data;

                // 해당 좌석 결제 취소 처리
                seatArr[reservation_num][x][y] = 0;

                const seat_num = JSON.stringify([x,y]);

                Sheet.update({ sheets_array: JSON.stringify(seatArr[reservation_num]) }, { where: { reservation_num } });

                // 유저가 예매취소했다고 예매내역 삭제해줘야함
                ReservedList.destroy({where: {user_id, show_id, reservation_num, seat_num}});
                // 좌석 정보 반환
                io.sockets.in(reservation_num).emit("getSeatsInfo", { seats: seatArr[reservation_num]});

                socket.emit("paymentReset", {message : "취소 완료"});

            } catch (error) {
                console.log(error);
                socket.emit("error", { message: "paymentReset 에러 발생", error });
            }
        });


    });
}

module.exports = initReservationSocket;