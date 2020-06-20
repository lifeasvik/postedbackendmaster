const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const helpers = require("./test-helpers");
const config = require("../src/config");

describe("Test Postcards", function () {
  let db;
  const testPosts = helpers.makePostArray();
  const testUsers = helpers.makeUsersArray();
  const testedPost = testPosts[0];
  const testUser = testUsers[0];
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  const expectedToken = jwt.sign({ user_id: testUser.id }, config.JWT_SECRET, {
    subject: testUser.user_name,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256",
  });

  beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
  beforeEach("insert postcard", () => helpers.seedPosts(db, testPosts));
  afterEach("cleanup", () => helpers.cleanTables(db));

  // Testing to see if postcard is empty
  describe(`POST /api/postcards`, () => {
    const requiredFields = ["title", "content"];
    requiredFields.forEach((field) => {
      const postAttemptBody = {
        title: testedPost.title,
        content: testedPost.content,
      };
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete postAttemptBody[field];
        return supertest(app)
          .post("/api/postcards")
          .set("Authorization", `Bearer ${expectedToken}`)
          .send(postAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    // Checks if the postcard matches
    context(`Happy path`, () => {
      it(`responds 201, `, () => {
        const newPost = {
          title: "test title",
          content:
            "https://images.unsplash.com/photo-1592597849579-43c25f4f02d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
        };
        return supertest(app)
          .post("/api/postcards")
          .set("Authorization", `Bearer ${expectedToken}`)
          .send(newPost)
          .expect(200)
          .expect((res) => {
            expect(res.body).to.have.property("title");
            expect(res.body).to.have.property("content");
          });
      });
    });
  });
});
