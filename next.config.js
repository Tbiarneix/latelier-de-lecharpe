/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next génère un AGENTS.md ; on maintient notre propre CLAUDE.md.
  agentRules: false,
}

module.exports = nextConfig
