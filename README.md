# Aesthetix Athlete Lab: AI Active Recovery & Bio-Tuning Engine

A premium, Olympic-level sports analytics and active recovery dashboard designed for elite decathletes. Powered by the **Vercel AI SDK**, **Groq**, and **Next.js 16 (App Router)**, this platform bridges the gap between generative artificial intelligence and high-fidelity, real-time biological feedback.

---

## 🌟 Showstopper Features

### 1. Two-Way Generative UI State Synchronization
Unlike standard chat assistants that merely display text, the Aesthetix dashboard wires a dynamic, real-time bidirectional data flow between the AI-prescribed recovery components and your physiological parent dashboard:
* **Active Muscle Checksheets**: Toggling mobility exercises inside the generative checksheet immediately recalibrates your **Recovery Score** in the sidebar.
* **Fluid Replacement Logs**: Clicking "Log Fluid Intake" inside the hydration widget immediately increments your daily **Hydration Levels** and recovery capacity in the main metrics interface.

### 2. Native Web Audio API Biometric Synthesizer
Includes a custom browser-based audio synthesizer that generates deep, physical **"lub-dub" heartbeat feedback** when interacting with the resting heart rate or EKG modules. 
* Employs dual exponential sine-wave oscillators (`55Hz` and `50Hz`) to simulate authentic cardiac acoustics with zero network latency, CORS issues, or external file loading.

### 3. Dynamic Karvonen EKG Heart Recovery Zones
* Renders a real-time EKG pulse line graph that scales its animation frequency exactly to the athlete's resting heart rate.
* Computes cardiac recovery zones (Active Recovery, Aerobic Endurance, Tempo, Threshold, VO2 Max) in real-time utilizing the **Karvonen formula**:
$$\text{Target Heart Rate} = (\text{Max HR} - \text{Resting HR}) \times \% \text{Intensity} + \text{Resting HR}$$

### 4. Interactive Front/Back Anatomical Heatmap
* Integrates dual vector muscle maps for front and back athlete views.
* Highlights severe, moderate, and mild soreness zones (Quadriceps, Lower Back, Calves) in dynamic fluorescent glow colors based on the AI scientist's localized diagnostics.

---

## 🛠️ Advanced Vercel AI SDK Tools Configuration

The AI backend route (`app/api/chat/route.ts`) acts as an elite sports scientist utilizing the latest **Vercel AI SDK Core** and **Groq Speedway** routing to stream replies and execute 4 advanced tools:
1. `suggest_macros`: Calibrates carbohydrate, protein, and fat target intakes in grams scaled dynamically by weight and training volume.
2. `prescribe_mobility`: Designs targeted myofascial release, static stretching, and athletic rehabilitation protocols.
3. `calculate_hydration`: Optimizes fluid replenishment volume (fl oz / liters) and sodium electrolyte concentrations (mg) based on workout duration, ambient temperature, and sweat rates.
4. `prescribe_aerobic_zones`: Generates Karvonen cardiac zones to guide recovery strain limits.

---

## 🚀 Getting Started (Run Locally)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ankittejyadav/athlete-recovery.git
cd athlete-recovery
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_free_groq_api_key_here
```

### 3. Spin Up Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the premium dashboard. Use the **Biomarker Stress Simulator** in the sidebar to immediately test advanced diagnostic and EKG zoning flows with a single click!
