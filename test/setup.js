const { expect } = require("chai");
const supertest = require("supertest");
const mocha = require("mocha");

require("dotenv").config();

global.expect = expect;
global.supertest = supertest;
