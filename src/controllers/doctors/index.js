const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../helpers/database/dbConnection");

const register = (req, res, next) => {
  db.query(
    `SELECT * FROM doctors WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          success: false,
          msg: "Bu mail adresi zaten kullanılıyor.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              success: false,
              msg: err,
            });
          } else {
            db.query(
              `INSERT INTO doctors (name, surname, phone, email, password) VALUES ('${
                req.body.name
              }','${req.body.surname}','${req.body.phone}',${db.escape(
                req.body.email
              )}, ${db.escape(hash)})`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    success: false,
                    msg: err,
                  });
                }
                return res.status(201).send({
                  success: true,
                  msg: "Kayıt başarılı giriş yapabilirsiniz.",
                });
              }
            );
          }
        });
      }
    }
  );
};
const login = (req, res, next) => {
  db.query(
    `SELECT * FROM doctors WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          success: false,
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          success: false,
          msg: "Email veya şifre yanlış!",
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              success: false,
              msg: "Email veya şifre yanlış!",
            });
          }
          if (bResult) {
            const token = jwt.sign(
              { id: result[0].id },
              "the-super-strong-secrect",
              { expiresIn: "1h" }
            );
            return res.status(200).send({
              success: true,
              token,
              user: result[0],
            });
          }
          return res.status(401).send({
            success: false,
            msg: "Email veya şifre yanlış!",
          });
        }
      );
    }
  );
};
module.exports = {
  register,
  login,
};
