var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "final_project",
});

try {
  conn.connect(console.log("Database bağlantısı başarılı !"));
} catch (error) {
  console.log(error);
}
module.exports = conn;
