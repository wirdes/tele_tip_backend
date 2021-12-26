var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "kratos.domainhizmetleri.com",
  user: "nfteksti_anda",
  password: "Cyber!3344",
  database: "nfteksti_anda",
});

try {
  conn.connect(console.log("Database bağlantısı başarılı !"));
} catch (error) {
  console.log(error);
}
module.exports = conn;
