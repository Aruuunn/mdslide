module.exports = {
  async up(db, client) {
    await db.collection("presentation").createIndex({ userID: 1 });
    await db.collection("presentation").createIndex({ createdAt: 1 });
    await db
      .collection("presentation")
      .createIndex({ "pubmeta.slug": 1 }, { unique: true, sparse: true });
  },

  async down(db, client) {
    await db.collection("presentation").dropIndex({ userID: 1 });
    await db.collection("presentation").dropIndex({ createdAt: 1 });
    await db.collection("presentation").dropIndex({ "pubmeta.slug": 1 });
  },
};
