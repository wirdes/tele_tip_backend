const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../helpers/database/dbConnection");

const register = (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
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
              `INSERT INTO users (name, surname, phone, email, password, image) VALUES ('${
                req.body.name
              }','${req.body.surname}','${req.body.phone}',${db.escape(
                req.body.email
              )}, ${db.escape(hash)},'default.png')`,
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
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
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
              { expiresIn: "10h" }
            );
            db.query(
              `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
            );
            return res.status(200).send({
              msg: "kayıt başarılı",
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

const getUser = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return res.status(422).json({
      message: "Lütfen giriş yapınız.",
    });
  }
  const theToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(theToken, "the-super-strong-secrect");
  db.query(
    "SELECT * FROM users where id=?",
    decoded.id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        user1: results[0],
        message: "İşlem Başarılı",
      });
    }
  );
};

const uploadImage = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return res.status(422).json({
      msg: "Lütfen giriş yapınız.",
    });
  }
  const theToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(theToken, "the-super-strong-secrect");

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }
  const file = req.files.file;

  file.mv(
    `${__dirname}/../../../public/uploads/${decoded.id}-${file.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    }
  );
  db.query(
    `UPDATE users SET image="${decoded.id}-${file.name}" where id=${decoded.id}`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          success: false,
          msg: err,
        });
      }
      db.query(
        `SELECT * FROM users WHERE id=${decoded.id}`,
        (err, result) => {
          if (err) {
            throw err;
            return res.status(400).send({
              success: false,
              msg: err,
            });
          }
          return res.status(200).send({
            success: true,
            user: result,
            msg: "Resim başarıyla güncellendi",
            token:theToken
          });
        }
      );
    }
  );
};

module.exports = {
  uploadImage,
  getUser,
  register,
  login,
};
