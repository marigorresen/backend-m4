const express = require("express");
const sqlite3 = require("sqlite3");

const router = express.Router();
const db = new sqlite3.Database("pirelli.db");
/*
CREATE TABLE "rastreamento" (
	"id"	INTEGER NOT NULL,
	"setor"	TEXT NOT NULL,
	"id_tablet"	INTEGER NOT NULL,
	"data_hora"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_tablet") REFERENCES "dispositivos"("id")
);
*/
// Rota GET para obter todos os rastreios
router.get("/", (req, res) => {
  const query = "SELECT * FROM rastreamento";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching historico" });
    }

    res.json(rows);
  });
});

// Rota GET para obter um usuário específico
router.get("/:id", (req, res) => {
  const query = "SELECT * FROM rastreamento WHERE id = ?";
  const userId = req.params.id;

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching user" });
    }

    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(row);
  });
});

// Rota POST para criar um novo usuário
router.post("/", (req, res) => {
  const { setor, id_tablet, data_hora } = req.body;

  const query =
    'INSERT INTO rastreamento (setor, id_tablet, data_hora) VALUES(?, ?,datetime("now", "localtime"))';

  const values = [setor, id_tablet, data_hora];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error creating user" });
    }

    res.json({
      id: this.lastID,
      setor,
      id_tablet,
      data_hora,
    });
  });
});

// Rota PUT para atualizar um usuário existente
router.put("/:id", (req, res) => {
  const { setor, id_tablet } = req.body;
  const userId = req.params.id;

  const query = "UPDATE rastreamento SET setor = ?, id_tablet = ? WHERE id = ?";
  const values = [setor, id_tablet, userId];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error updating user" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: userId,
      setor,
      id_tablet,
    });
  });
});

// Rota DELETE para excluir um usuário
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM rastreamento WHERE id = ?";

  db.run(query, [userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting user" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.sendStatus(204);
  });
});

module.exports = router;
