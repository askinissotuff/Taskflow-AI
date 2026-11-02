const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("../api/plan.js");

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    setHeader: function (key, value) { this.headers[key] = value; },
    status: function (code) { this.statusCode = code; return this; },
    json: function (body) { this.body = body; return this; }
  };
}

test("AI endpoint rejects non-POST requests", async () => {
  const res = responseRecorder();
  await handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
});

test("AI endpoint reports missing server-side provider key", async () => {
  const previous = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  const res = responseRecorder();
  await handler({ method: "POST", body: { goal: "Plan a project" } }, res);
  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /not configured/);
  if (previous) process.env.ANTHROPIC_API_KEY = previous;
});

test("AI endpoint validates goal length before calling provider", async () => {
  const previous = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = "test-key";
  const res = responseRecorder();
  await handler({ method: "POST", body: { goal: "x" } }, res);
  assert.equal(res.statusCode, 400);
  if (previous) process.env.ANTHROPIC_API_KEY = previous;
  else delete process.env.ANTHROPIC_API_KEY;
});
