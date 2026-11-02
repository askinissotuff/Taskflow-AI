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

test("AI endpoint returns validated Claude task suggestions", async () => {
  const previousKey = process.env.ANTHROPIC_API_KEY;
  const previousFetch = global.fetch;
  process.env.ANTHROPIC_API_KEY = "test-key";
  global.fetch = async function (url, options) {
    assert.equal(url, "https://api.anthropic.com/v1/messages");
    assert.equal(options.headers["x-api-key"], "test-key");
    return {
      ok: true,
      json: async function () {
        return { content: [{ type: "tool_use", name: "create_task_plan", input: {
          summary: "A focused plan",
          tasks: [
            { title: "Outline the goal", priority: "high", rationale: "Clarify the outcome." },
            { title: "Gather what you need", priority: "normal", rationale: "Prepare the basics." },
            { title: "Complete the first draft", priority: "normal", rationale: "Make a first version." }
          ]
        } }] };
      }
    };
  };
  try {
    const res = responseRecorder();
    await handler({ method: "POST", body: { goal: "Prepare a presentation", tasks: [] } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.provider, "Anthropic");
    assert.equal(res.body.tasks.length, 3);
    assert.equal(res.body.tasks[0].title, "Outline the goal");
  } finally {
    global.fetch = previousFetch;
    if (previousKey) process.env.ANTHROPIC_API_KEY = previousKey;
    else delete process.env.ANTHROPIC_API_KEY;
  }
});
