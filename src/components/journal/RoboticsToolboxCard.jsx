import React, { useState } from 'react';
import { Cpu, Zap, Calculator, Code2, Copy, Check } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

const COLOR_CODES = [
  { name: 'Black', val: 0, mult: 1, tol: null, bg: '#18181b', text: '#ffffff' },
  { name: 'Brown', val: 1, mult: 10, tol: 1, bg: '#78350f', text: '#ffffff' },
  { name: 'Red', val: 2, mult: 100, tol: 2, bg: '#dc2626', text: '#ffffff' },
  { name: 'Orange', val: 3, mult: 1000, tol: null, bg: '#ea580c', text: '#ffffff' },
  { name: 'Yellow', val: 4, mult: 10000, tol: null, bg: '#eab308', text: '#000000' },
  { name: 'Green', val: 5, mult: 100000, tol: 0.5, bg: '#16a34a', text: '#ffffff' },
  { name: 'Blue', val: 6, mult: 1000000, tol: 0.25, bg: '#2563eb', text: '#ffffff' },
  { name: 'Violet', val: 7, mult: 10000000, tol: 0.1, bg: '#7c3aed', text: '#ffffff' },
  { name: 'Gray', val: 8, mult: 100000000, tol: 0.05, bg: '#64748b', text: '#ffffff' },
  { name: 'White', val: 9, mult: 1000000000, tol: null, bg: '#f8fafc', text: '#000000' },
  { name: 'Gold', val: null, mult: 0.1, tol: 5, bg: '#d97706', text: '#ffffff' },
  { name: 'Silver', val: null, mult: 0.01, tol: 10, bg: '#94a3b8', text: '#000000' }
];

const SNIPPETS = [
  {
    title: 'FreeRTOS Dual-Core Task (Core 0)',
    desc: 'Run sensor loop on Core 0 while Core 1 handles communication',
    code: `void SensorTask(void *pvParameters) {
  for(;;) {
    // Read MPU6050 / Ultrasonic sensors
    vTaskDelay(pdMS_TO_TICKS(20)); // 50Hz update rate
  }
}

void setup() {
  xTaskCreatePinnedToCore(
    SensorTask, "Sensors", 4096, NULL, 1, NULL, 0 // Core 0
  );
}`
  },
  {
    title: 'Non-Blocking Millis Timer Loop',
    desc: 'Avoid delay() so control loops run smoothly',
    code: `unsigned long previousMillis = 0;
const long interval = 50; // 50ms loop (20Hz)

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    // Execute control loop / PID calculation
  }
}`
  },
  {
    title: 'ESP32 PWM Motor Controller (LEDC)',
    desc: 'Setup high-speed PWM for H-Bridge motor driver',
    code: `const int pwmPin = 18;
const int pwmChannel = 0;
const int freq = 5000;
const int resolution = 8; // 0-255

void setup() {
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(pwmPin, pwmChannel);
  ledcWrite(pwmChannel, 200); // 78% duty cycle speed
}`
  }
];

const RoboticsToolboxCard = ({ accentColor }) => {
  const [subTab, setSubTab] = useState('pinout'); // 'pinout' | 'resistor' | 'snippets'

  // Resistor Calculator State
  const [b1, setB1] = useState(1); // Brown (1)
  const [b2, setB2] = useState(0); // Black (0)
  const [b3, setB3] = useState(2); // Red (x100)
  const [tol, setTol] = useState(10); // Gold (5%)
  const [copiedIdx, setCopiedIdx] = useState(null);

  const rawVal = ((COLOR_CODES[b1]?.val || 0) * 10 + (COLOR_CODES[b2]?.val || 0)) * (COLOR_CODES[b3]?.mult || 1);
  const tolVal = COLOR_CODES[tol]?.tol || 5;

  const formatResistance = (ohms) => {
    if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(1)} MΩ`;
    if (ohms >= 1000) return `${(ohms / 1000).toFixed(1)} kΩ`;
    return `${ohms} Ω`;
  };

  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    soundEngine.playPop();
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="journal-card p-6 space-y-5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Hardware & Robotics Tooling
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            ESP32 pinouts, resistor color codes, and embedded FreeRTOS/C++ templates
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs">
          <button
            onClick={() => {
              soundEngine.playPop();
              setSubTab('pinout');
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              subTab === 'pinout' ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            ESP32 Pinout
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setSubTab('resistor');
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              subTab === 'resistor' ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Resistor Calculator
          </button>
          <button
            onClick={() => {
              soundEngine.playPop();
              setSubTab('snippets');
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              subTab === 'snippets' ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Code Snippets
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ESP32 PINOUT */}
      {subTab === 'pinout' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
              <span className="font-bold text-sky-400 block uppercase text-[10px] tracking-wider">
                I2C Communication
              </span>
              <div className="font-mono text-xs text-[var(--text-primary)] space-y-0.5">
                <div>SDA: <span className="font-bold text-sky-400">GPIO 21</span></div>
                <div>SCL: <span className="font-bold text-sky-400">GPIO 22</span></div>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">For OLED, MPU6050, BMP280</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
              <span className="font-bold text-emerald-400 block uppercase text-[10px] tracking-wider">
                SPI High-Speed Bus
              </span>
              <div className="font-mono text-xs text-[var(--text-primary)] space-y-0.5">
                <div>MOSI: <span className="font-bold text-emerald-400">GPIO 23</span></div>
                <div>MISO: <span className="font-bold text-emerald-400">GPIO 19</span></div>
                <div>SCK: <span className="font-bold text-emerald-400">GPIO 18</span></div>
                <div>CS: <span className="font-bold text-emerald-400">GPIO 5</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
              <span className="font-bold text-amber-400 block uppercase text-[10px] tracking-wider">
                ADC Analog Inputs
              </span>
              <div className="font-mono text-xs text-[var(--text-primary)] space-y-0.5">
                <div>Safe with WiFi:</div>
                <div className="font-bold text-amber-400">ADC1 (GPIO 32 - 39)</div>
              </div>
              <span className="text-[10px] text-rose-400/90 block">⚠️ ADC2 unavailable when WiFi active</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
              <span className="font-bold text-purple-400 block uppercase text-[10px] tracking-wider">
                Capacitive Touch Pins
              </span>
              <div className="font-mono text-xs text-[var(--text-primary)] space-y-0.5">
                <div>T0: GPIO 4 • T1: GPIO 0</div>
                <div>T2: GPIO 2 • T3: GPIO 15</div>
                <div>T4-T9: GPIO 12-14, 27, 32, 33</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RESISTOR COLOR CODE CALCULATOR */}
      {subTab === 'resistor' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[var(--text-muted)] block">Calculated Value:</span>
              <div className="text-3xl font-mono font-bold text-[var(--text-primary)] mt-1">
                {formatResistance(rawVal)} <span className="text-base text-amber-400">±{tolVal}%</span>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {rawVal.toLocaleString()} Ohms
              </span>
            </div>

            {/* Visual Resistor Band Preview */}
            <div className="flex items-center gap-2 p-3 bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-subtle)] self-start sm:self-auto">
              <span className="w-5 h-10 rounded" style={{ backgroundColor: COLOR_CODES[b1]?.bg }} />
              <span className="w-5 h-10 rounded" style={{ backgroundColor: COLOR_CODES[b2]?.bg }} />
              <span className="w-5 h-10 rounded" style={{ backgroundColor: COLOR_CODES[b3]?.bg }} />
              <div className="w-4" />
              <span className="w-5 h-10 rounded" style={{ backgroundColor: COLOR_CODES[tol]?.bg }} />
            </div>
          </div>

          {/* Band Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Band 1 (1st Digit)
              </label>
              <select
                value={b1}
                onChange={(e) => setB1(Number(e.target.value))}
                className="w-full p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
              >
                {COLOR_CODES.slice(1, 10).map((c, i) => (
                  <option key={c.name} value={i + 1}>{c.name} ({c.val})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Band 2 (2nd Digit)
              </label>
              <select
                value={b2}
                onChange={(e) => setB2(Number(e.target.value))}
                className="w-full p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
              >
                {COLOR_CODES.slice(0, 10).map((c, i) => (
                  <option key={c.name} value={i}>{c.name} ({c.val})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Band 3 (Multiplier)
              </label>
              <select
                value={b3}
                onChange={(e) => setB3(Number(e.target.value))}
                className="w-full p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
              >
                {COLOR_CODES.map((c, i) => (
                  <option key={c.name} value={i}>{c.name} (x{c.mult})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Band 4 (Tolerance)
              </label>
              <select
                value={tol}
                onChange={(e) => setTol(Number(e.target.value))}
                className="w-full p-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-primary)]"
              >
                <option value={10}>Gold (±5%)</option>
                <option value={11}>Silver (±10%)</option>
                <option value={1}>Brown (±1%)</option>
                <option value={2}>Red (±2%)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CODE SNIPPETS */}
      {subTab === 'snippets' && (
        <div className="space-y-3">
          {SNIPPETS.map((snip, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                    {snip.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {snip.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(snip.code, idx)}
                  className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-white px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]"
                >
                  {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIdx === idx ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-black/40 font-mono text-[11px] text-sky-300 overflow-x-auto">
                {snip.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoboticsToolboxCard;