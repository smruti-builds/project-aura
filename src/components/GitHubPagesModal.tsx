import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Github, Terminal, FileCode, Globe } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'standalone' | 'embed' | 'source'>('standalone');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const githubActionsYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  const embedIframeCode = `<div style="position: relative; width: 100%; height: 850px; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
  <iframe
    src="https://smruti-builds.github.io/project-aura/"
    title="Project AURA: Wearable Physiology & Stress Dynamics Simulator"
    width="100%"
    height="100%"
    style="border: none;"
    loading="lazy"
    allow="accelerometer"
  ></iframe>
</div>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0D121F] border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#090D16]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                GitHub Pages & Portfolio Deployment Guide
              </h3>
              <p className="text-xs text-slate-400">Everything needed to host or embed this simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-[#0B0F19] flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('standalone')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeSubTab === 'standalone'
                ? 'text-cyan-400 border-cyan-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Option A: Dedicated GitHub Pages URL (Recommended)
          </button>
          <button
            onClick={() => setActiveSubTab('embed')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeSubTab === 'embed'
                ? 'text-cyan-400 border-cyan-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Option B: Embed in Existing Portfolio
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {activeSubTab === 'standalone' && (
            <div className="space-y-4">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-slate-300 space-y-1">
                <span className="font-semibold text-cyan-300">Pre-Configured Compatibility:</span>
                <p className="text-slate-400">
                  <code className="text-cyan-200 bg-slate-900 px-1.5 py-0.5 rounded font-mono">vite.config.ts</code> has already been configured with <code className="text-cyan-200 bg-slate-900 px-1.5 py-0.5 rounded font-mono">base: './'</code> so relative assets work automatically in subdirectories like <code className="text-slate-300 font-mono">username.github.io/repo-name/</code>.
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-100">Push to a GitHub Repository</span>
                    <p className="text-slate-400">
                      Create a new repository (e.g. <code className="text-slate-200 font-mono">wearable-stress-simulator</code>) and push this codebase:
                    </p>
                    <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800 relative">
                      git init<br />
                      git add .<br />
                      git commit -m "Initial commit of wearable simulator"<br />
                      git remote add origin https://github.com/&lt;USERNAME&gt;/wearable-stress-simulator.git<br />
                      git branch -M main<br />
                      git push -u origin main
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-100">Enable GitHub Pages in Repo Settings</span>
                    <p className="text-slate-400">
                      Navigate to your GitHub repo → <strong className="text-slate-200">Settings</strong> → <strong className="text-slate-200">Pages</strong>:
                    </p>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-400">
                      <li>Under <strong className="text-slate-200">Source</strong>, select <strong className="text-cyan-400">GitHub Actions</strong>.</li>
                      <li>That's it! The pre-built workflow file (<code className="text-slate-300 font-mono">.github/workflows/deploy.yml</code>) will automatically build and publish the app.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-100">Live Website URL</span>
                    <p className="text-slate-400">
                      Your project will be live at:
                    </p>
                    <div className="bg-slate-950 px-3 py-2 rounded-lg font-mono text-cyan-300 text-xs border border-slate-800 flex items-center justify-between">
                      <span>https://&lt;your-username&gt;.github.io/wearable-stress-simulator/</span>
                      <Globe className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Actions YAML Code Block */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-slate-400">
                    Included Workflow: .github/workflows/deploy.yml
                  </span>
                  <button
                    onClick={() => handleCopy(githubActionsYaml, 'yaml')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedKey === 'yaml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'yaml' ? 'Copied' : 'Copy YAML'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg font-mono text-[10px] text-slate-400 border border-slate-800 max-h-36 overflow-y-auto">
                  {githubActionsYaml}
                </pre>
              </div>
            </div>
          )}

          {activeSubTab === 'embed' && (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                If your portfolio is already hosted on GitHub Pages (e.g. <code className="text-slate-200 font-mono">yourname.github.io</code>) as a personal website or blog, you can embed this interactive simulator seamlessly using a responsive iframe:
              </p>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-200">HTML Embed Snippet:</span>
                  <button
                    onClick={() => handleCopy(embedIframeCode, 'iframe')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedKey === 'iframe' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'iframe' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                  {embedIframeCode}
                </pre>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-slate-200">Key Features for Portfolio Visitors:</span>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-400">
                  <li>No backend or API keys required — runs completely offline in any browser.</li>
                  <li>Instant loading with 0 latency.</li>
                  <li>Visitors can interact with real-time sliders, triggers, and edge case benchmarks.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
