const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/books");
const db = require("./models/db");
const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method")); // form ?_method=PUT

// Home route - list semua buku, bisa filter category via query ?category=Teknologi
app.get("/", async (req, res) => {
  // delegasikan ke controller secara ringkas (kita bisa panggil ulang)
  const bookController = require("./controllers/bookController");
  return bookController.getAll(req, res);
});

// mount router untuk /books
app.use("/books", bookRoutes);

app.get("/api/books", (req, res) =>
  require("./controllers/bookController").getAll(req, res)
);
app.get("/api/books/:id", (req, res) =>
  require("./controllers/bookController").getById(req, res)
);
app.post("/api/books", (req, res) =>
  require("./controllers/bookController").create(req, res)
);
app.put("/api/books/:id", (req, res) =>
  require("./controllers/bookController").update(req, res)
);
app.delete("/api/books/:id", (req, res) =>
  require("./controllers/bookController").remove(req, res)
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
