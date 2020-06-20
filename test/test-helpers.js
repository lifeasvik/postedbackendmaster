const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

//create users for test
function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      user_name: "test-user-2",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      user_name: "test-user-3",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      user_name: "test-user-4",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

// create posts for test
function makePostArray() {
  return [
    {
      id: 1,
      title: "This is my first test card",
      content:
        "https://images.unsplash.com/photo-1592651595956-9dece157e4f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      title: "This is my second test card! Wohoo!",
      content:
        "https://images.unsplash.com/photo-1592632789188-eae7dfaa6b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=802",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

//cleanup tables after test
function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        posted_comments,
        posted_postcards,
        posted_users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE posted_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('posted_users_id_seq', 0)`),
        ])
      )
  );
}

//seed users into test
function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("posted_users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('posted_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

//insert postcard into db for testing purpose
function seedPosts(db, postcard) {
  return db
    .into("posted_postcards")
    .insert(postcard)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('posted_postcards_id_seq', ?)`, [
        postcard[postcard.length - 1].id,
      ])
    );
}

module.exports = {
  makeUsersArray,
  cleanTables,
  makeAuthHeader,
  seedUsers,
  seedPosts,
  makePostArray,
};
