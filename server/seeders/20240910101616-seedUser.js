"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        username: "fata",
      },
      {
        username: "rizky",
      },
      {
        username: "reza",
      },
    ];

    const user = data.map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Users", user);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
