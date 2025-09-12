const db = require("../models/db");

// ambil semua buku atau filter by category
exports.getAll = async (req, res) => {
  try {
    const category = req.query.category;
    let [rows] = category
      ? await db.query("SELECT * FROM books WHERE category = ?", [category])
      : await db.query("SELECT * FROM books");
    // jika request datang dari API (Accept: application/json) kembalikan JSON
    if (req.accepts("json") && req.get("Accept").includes("application/json")) {
      return res.json(rows);
    }
    res.render("index", { books: rows });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).send("Buku tidak ditemukan");
    if (req.accepts("json") && req.get("Accept").includes("application/json")) {
      return res.json(rows[0]);
    }
    res.render("detail", { book: rows[0] });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.showAddForm = (req, res) => res.render("form_add");

exports.create = async (req, res) => {
  try {
    const { name, category, price, publisher, image_url } = req.body;
    await db.query(
      "INSERT INTO books (name, category, price, publisher, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, category, parseFloat(price), publisher, image_url]
    );
    res
      .status(201)
      .send(
        `<script>alert('Buku berhasil ditambahkan'); window.location.href = '/'</script>`
      );
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).send("Buku tidak ditemukan");
    res.render("form_edit", { book: rows[0] });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, category, price, publisher, image_url } = req.body;
    await db.query(
      "UPDATE books SET name=?, category=?, price=?, publisher=?, image_url=? WHERE id=?",
      [name, category, parseFloat(price), publisher, image_url, id]
    );
    res
      .status(200)
      .send(
        `<script>alert('Buku berhasil diupdate'); window.location.href='/books/${id}';</script>`
      );
    res.redirect(`/books/${id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = ?", [req.params.id]);
    res
      .status(200)
      .send(
        `<script>alert('Buku berhasil dihapus'); window.location.href = '/';</script>`
      );
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
