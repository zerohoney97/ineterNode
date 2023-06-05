const Sequelize = require('sequelize');

class ReviewBoardLike extends Sequelize.Model {
    static init(sequelize){
        return super.init({

        },{
            sequelize,
            timestamps : true,
            modelName : "ReviewBoardLike",
            tableName : "reviewBoardLikes",
            paranoid : false,
            charset : "utf8",
            collate : "utf8_general_ci"
        })
    }

    static associate(db){
        db.ReviewBoardLike.belongsTo(db.FreeBoard,{foreignKey : "reviewBoard_id", targetKey : "id"})
        db.ReviewBoardLike.belongsTo(db.User,{foreignKey : "user_id", targetKey : "id"})
    }

}

module.exports = ReviewBoardLike;