const { signToken } = require("../helpers/jwt");
const { User, Score } = require("../models/index");

class GlobalController {
  static async register(req, res, next) {
    try {
      const { username } = req.body;

      await User.create({
        username,
      });

      const user = await User.findOne({
        where: {username}
      })

      const payload = {
        id: user.id,
        username: user.username
      }

      const access_token = signToken(payload)

      res.status(200).json({
        user,
        access_token
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllScore(req, res, next) {
    try {
      
      const score = await Score.findAll({
        include : User,
        limit : 10,
        order : [["score", "DESC"]]
      });

      res.status(200).json(score);
    } catch (error) {
      console.log(error);
    }
  }

  static async addScore(req, res, next){
    try {
      const {score} = req.body

      const scoreResult = await Score.create({
        score,
        UserId: req.addOnData.id
      })

      res.status(200).json(scoreResult)
    } catch (error) {
      console.log(error);
    }
  }

  static async getMyScore(req, res, next){
    try {
      const score = await Score.findAll({
        where: {UserId: req.addOnData.id}
      })

      res.status(200).json(score)
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = GlobalController;
