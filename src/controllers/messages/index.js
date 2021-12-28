const jwt = require("jsonwebtoken");
const { db } = require("../../helpers/database/dbConnection");
const {
  getUserbyIDMessage,
  makeQueryString,
} = require("../../helpers/messages");
const { isTokenIncluded } = require("../../helpers/tokens/tokenHelpers");

const getUserAllMessage = async (req, res, next) => {
  const { JWT_SECRET } = process.env;
  let control = isTokenIncluded(req);
  if (control.err) {
    res.status(400).send("Token çalışmıyor");
    return;
  }

  const decoded = jwt.verify(control.token, JWT_SECRET);

  const { id } = req.body;
  db.query(
    ` SELECT * FROM ((SELECT id,duo  FROM message WHERE message.target = ${id}  GROUP BY message.duo) UNION (SELECT id,duo  FROM message WHERE message.source = ${id}  GROUP BY message.duo)) as b GROUP BY duo ORDER BY id`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          success: false,
          msg: err,
        });
      }
      let a = [];
      result.map((e) => {
        a.push(getUserbyIDMessage(e.duo, id));
      });

      let str = makeQueryString(a);
      db.query(str, (err, result2) => {
        if (err) {
          throw err;
          return res.status(400).send({
            success: false,
            msg: err,
          });
        }
        result.map((item, index) => {
          item.name = result2[index].name;
          item.surname = result2[index].surname;
          return item;
        });

        return res.status(201).send({
          success: true,
          msg: result,
        });
      });

      //getUserbyIDMessage()
    }
  );
};

module.exports = {
  getUserAllMessage,
};
