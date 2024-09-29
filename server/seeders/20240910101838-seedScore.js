"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        UserId: 1,
        score: 1234,
      },
      {
        UserId: 2,
        score: 3434,
      },
      {
        UserId: 3,
        score: 34,
      },
    ];

    const score = data.map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Scores", score);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Scores", null, {});
  },
};
