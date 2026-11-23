/**
 * Builds the RESCUE RECON B.Tech project presentation (exactly 12 slides).
 * Run: node ppt/build-pptx.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PptxGenJS from 'pptxgenjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(__dirname, 'assets');
const outFile = path.join(__dirname, 'Rescue-Recon-Presentation.pptx');

const C = {
  charcoal: '101412',
  ink: '0E1311',
  panel: '17211C',
  panel2: '1E2A24',
  line: '314038',
  olive: '9AA56D',
  lime: 'C6E070',
  fog: 'E7ECE4',
  mute: '93A096',
  warn: 'E0B15A',
  alert: 'D97862',
  sea: '8FBFA8',
  white: 'FFFFFF',
};

function hasAsset(name) {
  return fs.existsSync(path.join(assets, name));
}

function img(name) {
  return path.join(assets, name);
}

function addGridBg(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: C.charcoal },
  });
  // subtle vertical / horizontal accent lines
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.06,
    h: '100%',
    fill: { color: C.lime },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 5.35,
    w: '100%',
    h: 0.02,
    fill: { color: C.line },
  });
}

function footer(slide, n) {
  slide.addText('RESCUE RECON  ·  SOFTWARE SIMULATION  ·  B.TECH MINI-PROJECT', {
    x: 0.35,
    y: 5.4,
    w: 7.8,
    h: 0.28,
    fontSize: 9,
    fontFace: 'Calibri',
    color: C.mute,
    margin: 0,
  });
  slide.addText(String(n).padStart(2, '0') + ' / 12', {
    x: 8.6,
    y: 5.4,
    w: 1.0,
    h: 0.28,
    fontSize: 9,
    fontFace: 'Calibri',
    color: C.olive,
    align: 'right',
    margin: 0,
  });
}

function titleBar(slide, eyebrow, title) {
  slide.addText(eyebrow, {
    x: 0.45,
    y: 0.22,
    w: 9.0,
    h: 0.28,
    fontSize: 11,
    fontFace: 'Calibri',
    color: C.lime,
    bold: true,
    margin: 0,
    charSpacing: 3,
  });
  slide.addText(title, {
    x: 0.45,
    y: 0.48,
    w: 9.0,
    h: 0.45,
    fontSize: 26,
    fontFace: 'Calibri',
    color: C.fog,
    bold: true,
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.45,
    y: 0.98,
    w: 1.4,
    h: 0.035,
    fill: { color: C.olive },
  });
}

function card(slide, x, y, w, h) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: C.panel },
    line: { color: C.line, width: 1 },
  });
}

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'WIDESCREEN_16x9', width: 10, height: 5.625 });
pptx.layout = 'WIDESCREEN_16x9';
pptx.author = 'RESCUE RECON Project Team';
pptx.title = 'RESCUE RECON — Semi-Autonomous Robot';
pptx.subject = 'B.Tech Mini-Project Presentation';

// ─── SLIDE 1: TITLE ───────────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: C.ink },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.08,
    h: '100%',
    fill: { color: C.lime },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.06,
    fill: { color: C.panel2 },
  });
  s.addText('B.TECH MINI-PROJECT  ·  ELECTRONICS & COMMUNICATION ENGINEERING', {
    x: 0.55,
    y: 0.55,
    w: 8.8,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Calibri',
    color: C.olive,
    bold: true,
    margin: 0,
    charSpacing: 2,
  });
  s.addText('RESCUE RECON', {
    x: 0.55,
    y: 1.15,
    w: 9.0,
    h: 0.7,
    fontSize: 44,
    fontFace: 'Calibri',
    color: C.fog,
    bold: true,
    margin: 0,
  });
  s.addText('SEMI-AUTONOMOUS ROBOT', {
    x: 0.55,
    y: 1.8,
    w: 9.0,
    h: 0.4,
    fontSize: 22,
    fontFace: 'Calibri',
    color: C.lime,
    bold: true,
    margin: 0,
    charSpacing: 2,
  });
  s.addText('AI-Based Rescue Monitoring and Human Detection Simulation', {
    x: 0.55,
    y: 2.35,
    w: 8.5,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Calibri',
    color: C.mute,
    margin: 0,
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.55,
    y: 2.85,
    w: 2.2,
    h: 0.04,
    fill: { color: C.olive },
  });

  card(s, 0.55, 3.15, 8.9, 1.55);
  s.addText(
    [
      { text: 'Department / College:  ', options: { color: C.mute } },
      { text: '[College Name]', options: { color: C.fog } },
      { text: '\nTeam Members:  ', options: { color: C.mute } },
      { text: '[Member 1], [Member 2], [Member 3]', options: { color: C.fog } },
      { text: '\nProject Guide:  ', options: { color: C.mute } },
      { text: '[Guide Name]', options: { color: C.fog } },
      { text: '\nAcademic Year:  ', options: { color: C.mute } },
      { text: '[YYYY – YYYY]', options: { color: C.fog } },
    ],
    {
      x: 0.75,
      y: 3.3,
      w: 8.5,
      h: 1.3,
      fontSize: 13,
      fontFace: 'Calibri',
      margin: 0,
      valign: 'middle',
    },
  );
  s.addText('SOFTWARE SIMULATION  ·  NO HARDWARE IN THIS SEMESTER BUILD', {
    x: 0.55,
    y: 5.15,
    w: 9.0,
    h: 0.25,
    fontSize: 10,
    fontFace: 'Calibri',
    color: C.sea,
    bold: true,
    margin: 0,
  });
}

// ─── SLIDE 2: ABSTRACT ────────────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '01  OVERVIEW', 'Abstract');
  footer(s, 2);

  card(s, 0.45, 1.25, 9.1, 3.7);
  s.addText(
    'RESCUE RECON is a semi-autonomous rescue robot concept designed to assist rescue teams in hazardous environments. The system concept combines camera-based observation, AI-based human detection, environmental monitoring, obstacle awareness, and location information.',
    {
      x: 0.7,
      y: 1.45,
      w: 8.6,
      h: 1.35,
      fontSize: 15,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
      valign: 'top',
    },
  );
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7,
    y: 2.95,
    w: 8.6,
    h: 0.02,
    fill: { color: C.line },
  });
  s.addText('Current semester implementation', {
    x: 0.7,
    y: 3.15,
    w: 8.6,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Calibri',
    color: C.lime,
    bold: true,
    margin: 0,
  });
  s.addText(
    'A browser-based software simulation and web monitoring interface that demonstrates robot movement, virtual human detection, sensor telemetry, obstacle awareness, and a centralized mission dashboard — without physical robot or sensor hardware.',
    {
      x: 0.7,
      y: 3.5,
      w: 8.6,
      h: 1.2,
      fontSize: 14,
      fontFace: 'Calibri',
      color: C.mute,
      margin: 0,
    },
  );
}

// ─── SLIDE 3: PROBLEM ─────────────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '02  NEED', 'Problem Statement & Motivation');
  footer(s, 3);

  const problems = [
    { t: 'Hazardous entry', d: 'Rescue personnel may face unstable structures, gas, and debris in disaster zones.' },
    { t: 'Limited visibility', d: 'Locating people inside collapsed or inaccessible areas remains difficult.' },
    { t: 'Situational gap', d: 'Teams need remote observation before committing people into unsafe spaces.' },
    { t: 'Decision support', d: 'Environmental cues and human-location hints can improve rescue planning.' },
  ];
  problems.forEach((p, i) => {
    const x = 0.45 + (i % 2) * 4.7;
    const y = 1.25 + Math.floor(i / 2) * 1.85;
    card(s, x, y, 4.45, 1.65);
    s.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 0.08,
      h: 1.65,
      fill: { color: i % 2 === 0 ? C.lime : C.olive },
    });
    s.addText(p.t, {
      x: x + 0.3,
      y: y + 0.25,
      w: 3.9,
      h: 0.35,
      fontSize: 15,
      fontFace: 'Calibri',
      color: C.fog,
      bold: true,
      margin: 0,
    });
    s.addText(p.d, {
      x: x + 0.3,
      y: y + 0.7,
      w: 3.9,
      h: 0.75,
      fontSize: 13,
      fontFace: 'Calibri',
      color: C.mute,
      margin: 0,
    });
  });
}

// ─── SLIDE 4: OBJECTIVES ──────────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '03  GOALS', 'Objectives');
  footer(s, 4);

  const objs = [
    'Remote observation of hazardous environments',
    'Human detection concept using AI / ML',
    'Environmental condition monitoring',
    'Obstacle awareness during navigation',
    'Location information for the robot path',
    'Centralized remote monitoring dashboard',
    'Support rescue-team decision-making',
  ];
  objs.forEach((text, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i < 4 ? i : i - 4;
    const x = 0.45 + col * 4.7;
    const y = 1.25 + row * 0.9;
    card(s, x, y, 4.45, 0.78);
    s.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.18,
      y: y + 0.22,
      w: 0.34,
      h: 0.34,
      fill: { color: C.panel2 },
      line: { color: C.lime, width: 1 },
      rectRadius: 0.05,
    });
    s.addText(String(i + 1), {
      x: x + 0.18,
      y: y + 0.22,
      w: 0.34,
      h: 0.34,
      fontSize: 11,
      fontFace: 'Calibri',
      color: C.lime,
      align: 'center',
      valign: 'middle',
      bold: true,
      margin: 0,
    });
    s.addText(text, {
      x: x + 0.65,
      y: y + 0.18,
      w: 3.55,
      h: 0.45,
      fontSize: 13,
      fontFace: 'Calibri',
      color: C.fog,
      valign: 'middle',
      margin: 0,
    });
  });
}

// ─── SLIDE 5: PROPOSED SYSTEM ─────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '04  CONCEPT', 'Proposed System');
  footer(s, 5);

  card(s, 0.45, 1.2, 5.5, 3.85);
  s.addText('Intended rescue-robot concept', {
    x: 0.65,
    y: 1.35,
    w: 5.1,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Calibri',
    color: C.lime,
    bold: true,
    margin: 0,
  });
  const parts = [
    'Camera for environmental observation',
    'AI / ML-based human detection',
    'Environmental sensors (gas, temp, humidity)',
    'Obstacle detection (ultrasonic concept)',
    'GPS / location information',
    'Communication interface',
    'Web monitoring dashboard for rescue teams',
  ];
  parts.forEach((t, i) => {
    s.addText('▸  ' + t, {
      x: 0.7,
      y: 1.75 + i * 0.4,
      w: 5.0,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
    });
  });

  card(s, 6.15, 1.2, 3.4, 3.85);
  s.addText('This semester', {
    x: 6.35,
    y: 1.4,
    w: 3.0,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Calibri',
    color: C.warn,
    bold: true,
    margin: 0,
  });
  s.addText(
    'Software simulation only.\n\nVirtual robot, virtual sensors, and simulated detection inside a web dashboard.\n\nNo physical robot, no live sensor bus, no deployed YOLO model.',
    {
      x: 6.35,
      y: 1.85,
      w: 3.0,
      h: 2.8,
      fontSize: 13,
      fontFace: 'Calibri',
      color: C.mute,
      margin: 0,
    },
  );
}

// ─── SLIDE 6: ARCHITECTURE ────────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '05  DESIGN', 'System Architecture');
  footer(s, 6);

  const blocks = [
    { x: 0.35, y: 1.25, w: 1.7, label: 'CAMERA' },
    { x: 2.2, y: 1.25, w: 1.85, label: 'IMAGE\nCAPTURE' },
    { x: 4.2, y: 1.25, w: 2.1, label: 'AI / ML\nHUMAN DETECTION' },
    { x: 6.5, y: 1.25, w: 1.85, label: 'DETECTION\nOUTPUT' },
  ];
  blocks.forEach((b, i) => {
    s.addShape(pptx.ShapeType.rect, {
      x: b.x,
      y: b.y,
      w: b.w,
      h: 0.85,
      fill: { color: C.panel2 },
      line: { color: C.lime, width: 1 },
    });
    s.addText(b.label, {
      x: b.x,
      y: b.y,
      w: b.w,
      h: 0.85,
      fontSize: 11,
      fontFace: 'Calibri',
      color: C.fog,
      align: 'center',
      valign: 'middle',
      bold: true,
      margin: 0,
    });
    if (i < blocks.length - 1) {
      s.addText('→', {
        x: b.x + b.w,
        y: b.y,
        w: blocks[i + 1].x - (b.x + b.w),
        h: 0.85,
        fontSize: 16,
        color: C.olive,
        align: 'center',
        valign: 'middle',
        margin: 0,
      });
    }
  });

  s.addText('SENSOR INPUTS', {
    x: 0.35,
    y: 2.3,
    w: 4.5,
    h: 0.28,
    fontSize: 11,
    fontFace: 'Calibri',
    color: C.olive,
    bold: true,
    margin: 0,
  });

  const sensors = ['MQ-2 Gas', 'DHT11 T/H', 'Ultrasonic', 'GPS'];
  sensors.forEach((label, i) => {
    const x = 0.35 + i * 1.55;
    s.addShape(pptx.ShapeType.rect, {
      x,
      y: 2.65,
      w: 1.4,
      h: 0.55,
      fill: { color: C.panel },
      line: { color: C.line, width: 1 },
    });
    s.addText(label, {
      x,
      y: 2.65,
      w: 1.4,
      h: 0.55,
      fontSize: 11,
      fontFace: 'Calibri',
      color: C.fog,
      align: 'center',
      valign: 'middle',
      margin: 0,
    });
  });

  const flow = [
    { x: 0.35, label: 'DATA\nPROCESSING' },
    { x: 2.55, label: 'COMMUNICATION\nINTERFACE' },
    { x: 4.85, label: 'WEB\nDASHBOARD' },
    { x: 7.15, label: 'RESCUE\nTEAM' },
  ];
  flow.forEach((b, i) => {
    s.addShape(pptx.ShapeType.rect, {
      x: b.x,
      y: 3.55,
      w: 1.95,
      h: 0.85,
      fill: { color: i === 3 ? C.panel2 : C.panel },
      line: { color: i === 3 ? C.lime : C.olive, width: 1 },
    });
    s.addText(b.label, {
      x: b.x,
      y: 3.55,
      w: 1.95,
      h: 0.85,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C.fog,
      align: 'center',
      valign: 'middle',
      bold: true,
      margin: 0,
    });
    if (i < flow.length - 1) {
      s.addText('→', {
        x: b.x + 1.95,
        y: 3.55,
        w: 0.25,
        h: 0.85,
        fontSize: 16,
        color: C.olive,
        align: 'center',
        valign: 'middle',
        margin: 0,
      });
    }
  });

  s.addText('Concept architecture — current build realises the dashboard & simulation layers in software.', {
    x: 0.35,
    y: 4.6,
    w: 9.2,
    h: 0.35,
    fontSize: 11,
    fontFace: 'Calibri',
    color: C.mute,
    italic: true,
    margin: 0,
  });
}

// ─── SLIDE 7: COMPONENTS ──────────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '06  STACK', 'Components & Technologies');
  footer(s, 7);

  s.addTable(
    [
      [
        { text: 'Component', options: { fill: { color: C.panel2 }, color: C.lime, bold: true } },
        { text: 'Purpose in project', options: { fill: { color: C.panel2 }, color: C.lime, bold: true } },
        { text: 'Status', options: { fill: { color: C.panel2 }, color: C.lime, bold: true } },
      ],
      ['Camera', 'Visual observation', 'Simulated viewport'],
      ['AI / ML (YOLO concept)', 'Human detection concept', 'Rule-based simulation'],
      ['MQ-2', 'Gas monitoring concept', 'Virtual sensor data'],
      ['DHT11', 'Temperature & humidity', 'Virtual sensor data'],
      ['Ultrasonic', 'Distance / obstacle awareness', 'Virtual distance'],
      ['GPS', 'Location information', 'Simulated coordinates'],
      ['Web dashboard', 'Remote monitoring', 'Implemented (React)'],
    ],
    {
      x: 0.45,
      y: 1.2,
      w: 9.1,
      colW: [2.5, 3.6, 3.0],
      border: [{ pt: 0.5, color: C.line }],
      fontFace: 'Calibri',
      fontSize: 12,
      color: C.fog,
      align: 'left',
      valign: 'middle',
    },
  );

  s.addText(
    'Software: React · JavaScript · Vite · Tailwind · Recharts   |   Concepts: Computer Vision · YOLO · Python (future hardware path)',
    {
      x: 0.45,
      y: 4.75,
      w: 9.1,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Calibri',
      color: C.sea,
      margin: 0,
    },
  );
}

// ─── SLIDE 8: WORKFLOW ────────────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '07  PROCESS', 'System Workflow');
  footer(s, 8);

  const steps = [
    { n: '1', t: 'Virtual environment\ninitialization' },
    { n: '2', t: 'Robot movement\nin simulation' },
    { n: '3', t: 'Virtual camera\nobservation' },
    { n: '4', t: 'Simulated human\ndetection' },
    { n: '5', t: 'Sensor-value\nsimulation' },
    { n: '6', t: 'Obstacle\nawareness' },
    { n: '7', t: 'Dashboard\nupdates' },
    { n: '8', t: 'Rescue-team\nmonitoring' },
  ];
  steps.forEach((step, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.4 + col * 2.4;
    const y = 1.3 + row * 1.85;
    card(s, x, y, 2.2, 1.45);
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.85,
      y: y + 0.18,
      w: 0.45,
      h: 0.45,
      fill: { color: C.panel2 },
      line: { color: C.lime, width: 1.25 },
    });
    s.addText(step.n, {
      x: x + 0.85,
      y: y + 0.18,
      w: 0.45,
      h: 0.45,
      fontSize: 14,
      fontFace: 'Calibri',
      color: C.lime,
      align: 'center',
      valign: 'middle',
      bold: true,
      margin: 0,
    });
    s.addText(step.t, {
      x: x + 0.1,
      y: y + 0.75,
      w: 2.0,
      h: 0.6,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C.fog,
      align: 'center',
      margin: 0,
    });
    if (col < 3) {
      s.addText('→', {
        x: x + 2.15,
        y: y + 0.45,
        w: 0.3,
        h: 0.4,
        fontSize: 16,
        color: C.olive,
        align: 'center',
        margin: 0,
      });
    }
  });
}

// ─── SLIDE 9: SIMULATION ENVIRONMENT ──────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '08  IMPLEMENTATION', 'Software Simulation Environment');
  footer(s, 9);

  const shot = hasAsset('simulation.png')
    ? 'simulation.png'
    : hasAsset('sim-map.png')
      ? 'sim-map.png'
      : null;

  if (shot) {
    s.addImage({
      path: img(shot),
      x: 0.4,
      y: 1.2,
      w: 5.5,
      h: 3.7,
    });
  } else {
    card(s, 0.4, 1.2, 5.5, 3.7);
    s.addText('Simulation screenshot', {
      x: 0.4,
      y: 2.7,
      w: 5.5,
      h: 0.4,
      align: 'center',
      color: C.mute,
      fontSize: 14,
      fontFace: 'Calibri',
    });
  }

  card(s, 6.1, 1.2, 3.45, 3.7);
  s.addText('SOFTWARE SIMULATION', {
    x: 6.3,
    y: 1.4,
    w: 3.05,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Calibri',
    color: C.warn,
    bold: true,
    margin: 0,
  });
  const feats = [
    'Virtual disaster floor map',
    'Keyboard / on-screen robot drive',
    'Human search-target markers',
    'Rubble & wall obstacles',
    'Camera field-of-view cone',
    'Simulated sensor readings',
    'Virtual GPS coordinates',
    'Live mission activity log',
  ];
  feats.forEach((t, i) => {
    s.addText('•  ' + t, {
      x: 6.3,
      y: 1.85 + i * 0.35,
      w: 3.05,
      h: 0.32,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
    });
  });
}

// ─── SLIDE 10: DASHBOARD ──────────────────────────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '09  INTERFACE', 'Web Dashboard & Features');
  footer(s, 10);

  const tiles = [
    { file: 'overview.png', label: 'Mission Overview' },
    { file: 'simulation.png', label: 'Robot Simulation' },
    { file: 'vision.png', label: 'AI Vision' },
    { file: 'sensors.png', label: 'Sensors' },
    { file: 'logs.png', label: 'Mission Logs' },
  ];
  tiles.forEach((tile, i) => {
    const x = 0.35 + i * 1.88;
    const y = 1.15;
    card(s, x, y, 1.78, 2.35);
    if (hasAsset(tile.file)) {
      s.addImage({
        path: img(tile.file),
        x: x + 0.06,
        y: y + 0.06,
        w: 1.66,
        h: 1.85,
      });
    }
    s.addText(tile.label, {
      x: x + 0.05,
      y: y + 1.95,
      w: 1.68,
      h: 0.32,
      fontSize: 10,
      fontFace: 'Calibri',
      color: C.olive,
      align: 'center',
      bold: true,
      margin: 0,
    });
  });

  card(s, 0.35, 3.7, 9.3, 1.35);
  s.addText('Working demo features', {
    x: 0.55,
    y: 3.85,
    w: 8.9,
    h: 0.28,
    fontSize: 12,
    fontFace: 'Calibri',
    color: C.lime,
    bold: true,
    margin: 0,
  });
  s.addText(
    'Interactive robot movement  ·  Simulated human detection  ·  Obstacle warnings  ·  Sensor telemetry  ·  Location visualization  ·  Mission event log',
    {
      x: 0.55,
      y: 4.2,
      w: 8.9,
      h: 0.6,
      fontSize: 13,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
    },
  );
}

// ─── SLIDE 11: RESULTS / LIMITATIONS / FUTURE ─────────────────────
{
  const s = pptx.addSlide();
  addGridBg(s);
  titleBar(s, '10  OUTCOMES', 'Results, Limitations & Future Scope');
  footer(s, 11);

  // Results
  card(s, 0.35, 1.2, 3.05, 3.85);
  s.addText('Current results', {
    x: 0.5,
    y: 1.35,
    w: 2.75,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Calibri',
    color: C.lime,
    bold: true,
    margin: 0,
  });
  [
    'Functional web dashboard',
    'Virtual robot environment',
    'Simulated movement & collision',
    'Simulated human detection',
    'Virtual sensor telemetry',
    'Mission log & monitoring UI',
  ].forEach((t, i) => {
    s.addText('•  ' + t, {
      x: 0.5,
      y: 1.8 + i * 0.45,
      w: 2.75,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
    });
  });

  // Limitations
  card(s, 3.5, 1.2, 3.05, 3.85);
  s.addText('Limitations', {
    x: 3.65,
    y: 1.35,
    w: 2.75,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Calibri',
    color: C.warn,
    bold: true,
    margin: 0,
  });
  [
    'No physical robot prototype',
    'Sensor readings are simulated',
    'Detection is simulation-based',
    'No real GPS hardware',
    'No real-world field testing',
  ].forEach((t, i) => {
    s.addText('•  ' + t, {
      x: 3.65,
      y: 1.8 + i * 0.45,
      w: 2.75,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
    });
  });

  // Future
  card(s, 6.65, 1.2, 2.95, 3.85);
  s.addText('Future scope', {
    x: 6.8,
    y: 1.35,
    w: 2.65,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Calibri',
    color: C.sea,
    bold: true,
    margin: 0,
  });
  [
    'Hardware prototype',
    'Real-time AI detection',
    'Camera integration',
    'Live sensor integration',
    'Thermal imaging',
    'Advanced navigation',
  ].forEach((t, i) => {
    s.addText('•  ' + t, {
      x: 6.8,
      y: 1.8 + i * 0.45,
      w: 2.65,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
    });
  });
}

// ─── SLIDE 12: CONCLUSION ─────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: C.ink },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.08,
    h: '100%',
    fill: { color: C.lime },
  });

  s.addText('CONCLUSION', {
    x: 0.55,
    y: 0.55,
    w: 9.0,
    h: 0.35,
    fontSize: 12,
    fontFace: 'Calibri',
    color: C.lime,
    bold: true,
    margin: 0,
    charSpacing: 3,
  });
  s.addText(
    'RESCUE RECON demonstrates the concept of a semi-autonomous rescue robot through software simulation — integrating virtual robot movement, human-detection visualization, environmental monitoring, and remote dashboard observation.',
    {
      x: 0.55,
      y: 1.05,
      w: 8.9,
      h: 1.2,
      fontSize: 16,
      fontFace: 'Calibri',
      color: C.fog,
      margin: 0,
    },
  );

  s.addText('FUTURE DEVELOPMENT', {
    x: 0.55,
    y: 2.4,
    w: 9.0,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Calibri',
    color: C.olive,
    bold: true,
    margin: 0,
    charSpacing: 2,
  });
  s.addText(
    'The project provides a foundation for future physical implementation, real sensor integration, and deployed computer-vision models.',
    {
      x: 0.55,
      y: 2.8,
      w: 8.9,
      h: 0.7,
      fontSize: 14,
      fontFace: 'Calibri',
      color: C.mute,
      margin: 0,
    },
  );

  s.addShape(pptx.ShapeType.rect, {
    x: 0.55,
    y: 3.7,
    w: 2.0,
    h: 0.04,
    fill: { color: C.olive },
  });

  s.addText('THANK YOU', {
    x: 0.55,
    y: 4.0,
    w: 9.0,
    h: 0.45,
    fontSize: 28,
    fontFace: 'Calibri',
    color: C.fog,
    bold: true,
    margin: 0,
  });
  s.addText('Questions welcome', {
    x: 0.55,
    y: 4.5,
    w: 9.0,
    h: 0.35,
    fontSize: 14,
    fontFace: 'Calibri',
    color: C.sea,
    margin: 0,
  });
  s.addText('12 / 12', {
    x: 8.6,
    y: 5.25,
    w: 1.0,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Calibri',
    color: C.olive,
    align: 'right',
    margin: 0,
  });
}

await pptx.writeFile({ fileName: outFile });
console.log('Wrote', outFile);
