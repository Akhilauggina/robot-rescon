# Rescue Recon

Browser-based semi-autonomous rescue robot simulation for academic demonstration. There is no hardware, backend, or real sensor input. Every reading is generated in the browser and labeled as simulation data.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173).

## Demonstrate

1. Start on Mission Overview and show the live simulated status.
2. Open Robot Simulation, press **Start**, and drive with W A S D or the arrow keys.
3. Drive into the central hall until a survivor marker is acquired.
4. Show the virtual camera, then AI Vision, Sensor Monitoring, and Mission Logs.

`npm run validate` checks that the map is navigable and that detection and collision behave as intended.
