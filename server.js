const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "user-manager",
});
connection.connect((err) => {
  if (err) {
    console.error("Kết nối thất bại:", err);
    return;
  }
  console.log("Kết nối thành công");
});
// post
app.post("/api/v1/users", (req, res) => {
  const { name, email, age } = req.body;
  const sql = "INSERT INTO user (name, email, age) VALUES (?, ?, ?)";
  connection.query(sql, [name, email, age], (err, result) => {
    if (err) {
      console.error("không thêm mới người dùng", err);
      res.status(500).json({ error: "thêm mới thất bại" });
    } else {
      res.status(201).json({ message: "Thêm mới thành công" });
    }
  });
});

// get all users
app.get("/api/v1/users", (req, res) => {
  const sql = "SELECT * FROM user";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Thất bại", err);
      res.status(500).json({ error: "ERROR" });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get("/api/v1/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Thất bại :", err);
      res.status(500).json({ error: "ERROR" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Không tồn tại" });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

//put
app.patch("/api/v1users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;
  const sql = "UPDATE user SET name=?, email=?, age=? WHERE id=?";
  connection.query(sql, [name, email, age, userId], (err, result) => {
    if (err) {
      console.error("ERROR", err);
      res.status(500).json({ error: "cập nhật thất bại" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "không tồn tại" });
    } else {
      res.status(200).json({ message: "cập nhật thành công" });
    }
  });
});

// delete user
app.delete("/api/v1/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM user WHERE id=?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("thất bại", err);
      res.status(500).json({ error: "xóa thất bại" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "không tồn tại" });
    } else {
      res.status(200).json({ message: "xóa thành công" });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
