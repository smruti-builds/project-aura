# Project AURA: Wearable Physiology & Stress Dynamics Simulator

An interactive, browser-based digital twin and clinical laboratory simulating multi-channel wearable device streams (ECG/Heart Rate, HRV RMSSD, Electrodermal Activity EDA, Respiration Rate, 3-Axis Accelerometer, and Skin Temperature).

This simulator evaluates the systemic failure modes of first-generation **4-Stage Rigid Pipelines** (Baseline → Trigger → Recovery → Overload) against a modern **3-Dimensional Parallel Model** grounded in autonomic neuroscience, polyvagal theory, and empirical clinical psychology.

---

## 🚀 Live Demo & Portfolio Integration

- **Offline & In-Browser**: 100% client-side mathematical signal synthesis (10 Hz). No backend servers or API keys required.
- **Pre-Configured for GitHub Pages**: `vite.config.ts` uses `base: './'`, enabling direct hosting on any GitHub Pages domain or subfolder.
- **GitHub Actions Workflow**: Automatically deployed via `.github/workflows/deploy.yml`.

---

## 🛠️ How to Deploy to Your GitHub Pages Portfolio

### Standalone GitHub Repository: `project-aura`

1. **Create a new repository** on GitHub named `project-aura` under your account (`smruti-builds`).
2. **Push this project** to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Project AURA"
   git remote add origin git@github.com:smruti-builds/project-aura.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Actions Pages**:
   - Go to your repository on GitHub (`smruti-builds/project-aura`).
   - Navigate to **Settings** → **Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.
4. GitHub Actions will automatically run the included `.github/workflows/deploy.yml` workflow, build the bundle, and publish it to:
   ```
   https://smruti-builds.github.io/project-aura/
   ```

---

### Option 2: Embed Inside Your Existing Portfolio Website

If you already have a personal portfolio site running on GitHub Pages (e.g. `yourname.github.io`), you can embed this simulator directly into any project showcase page using a responsive iframe:

```html
<div style="position: relative; width: 100%; height: 850px; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
  <iframe
    src="https://<YOUR_USERNAME>.github.io/wearable-stress-simulator/"
    title="AURA: Wearable Physiology & Stress Simulator"
    width="100%"
    height="100%"
    style="border: none;"
    loading="lazy"
  ></iframe>
</div>
```

---

## 🔬 Core Clinical Concepts Explored

### 1. Deconstructing the 4 Stages
- **Stage 1 (Baseline)**: Explores baseline drift under caffeine, poor sleep, and chronic stress vs fixed assumptions.
- **Stage 2 (Trigger Response)**: Demonstrates why stairs climbing or heat are misdiagnosed as acute panic, and why outputs must be labelled *Physiological Arousal Detected* rather than psychological diagnosis.
- **Stage 3 (Recovery Check)**: Separates physiological recovery from lingering emotional distress and trauma numbing.
- **Stage 4 (Possible Overload)**: Replaces rigid trigger counters ($3\text{ triggers} = \text{Overload Alarm}$) with confidence-aware allostatic trajectory scoring.

### 2. The Missing Dimension
- **Polyvagal Freeze & Hypo-arousal**: Stephen Porges' Polyvagal Theory demonstrates that emotional overwhelm can produce bradycardia, shallow breath, and immobility—which naive arousal-only models mistake for "peaceful meditation."

### 3. The 3-Dimensional Parallel Framework
1. **Physiological Activation**: Distance from a context-aware baseline (factoring 3-axis motion and thermal dissipation).
2. **Persistence & Recovery Trajectory**: Recovery half-life, decay slope, and allostatic accumulation.
3. **Self-Reported Readiness & Agency**: User's subjective report, coping capacity, and privacy preference.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build production bundle for static hosting
npm run build
```
