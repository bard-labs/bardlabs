const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000"

const checks = [
  ["homepage", "/", 200],
  ["projects", "/projects", 200],
  ["logs", "/log", 200],
  ["brain", "/brain", 200],
  ["dashboard redirect", "/dashboard", 307],
]

let failed = false
for (const [name, path, expected] of checks) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" })
  const pass = response.status === expected
  console.log(`${pass ? "PASS" : "FAIL"} ${name}: ${response.status} (expected ${expected})`)
  if (!pass) failed = true
}

const malformed = await fetch(`${baseUrl}/api/contact`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{",
})
const malformedPass = malformed.status === 400
console.log(`${malformedPass ? "PASS" : "FAIL"} malformed contact JSON: ${malformed.status} (expected 400)`)
if (!malformedPass) failed = true

process.exitCode = failed ? 1 : 0
