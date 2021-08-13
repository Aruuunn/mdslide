module.exports = {
  async up(db, client) {
    await db.collection("presentation").createIndex({ userID: 1 });
  },

  async down(db, client) {
    await db.collection("presentation").dropIndex({ userID: 1 });
  },
};
