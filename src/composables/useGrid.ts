import * as Tone from "tone";
import { ref, onUnmounted } from "vue";
import type { Widget } from "../types";
import { GRID_SIZE, ALL_SCALES, convertBpmToInterval, convertIntervalToBpm } from "../constants";

export function useGrid() {
  const gridSize = GRID_SIZE;

  const widgets = ref<Record<number, Widget>>({});
  const synths = ref<Record<number, Tone.Synth>>({});
  const ctr = ref(0);
  const scaleId = ref(0);
  const interval = ref(convertBpmToInterval(150));
  const timerSet = ref(false);

  let timerId: ReturnType<typeof setInterval> | null = null;
  const reverb = new Tone.Reverb(0.3).toDestination();
  const feedback = new Tone.FeedbackDelay(0.3, 0.2).toDestination();

  function generateSynth(): Tone.Synth {
    return new Tone.Synth().connect(reverb).connect(feedback).toDestination();
  }

  function initGrid(): string[][] {
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
  }

  function updateGrid(): string[][] {
    const grid = initGrid();
    Object.values(widgets.value).forEach((w) => {
      grid[w.pos[1]][w.pos[0]] += getArrow(w.dir);
    });
    return grid;
  }

  function getArrow(dir: number): string {
    if (dir === 0) return "↑";
    if (dir === 1) return "→";
    if (dir === 2) return "↓";
    return "←";
  }

  const grid = ref<string[][]>(initGrid());

  function addWidget(pos0: number, pos1: number, dir = 0) {
    const idx = ctr.value;
    const newWidgets = { ...widgets.value, [idx]: { idx, pos: [pos0, pos1] as [number, number], dir } };
    const newSynths = { ...synths.value, [idx]: generateSynth() };
    widgets.value = newWidgets;
    synths.value = newSynths;
    ctr.value++;
    grid.value = updateGrid();
  }

  function didHitWall(pos: [number, number], dir: number): boolean {
    const last = gridSize - 1;
    return (
      (dir === 0 && pos[1] === 0) ||
      (dir === 1 && pos[0] === last) ||
      (dir === 2 && pos[1] === last) ||
      (dir === 3 && pos[0] === 0)
    );
  }

  function makeSound(pos: [number, number], dir: number, synth: Tone.Synth) {
    let val = 0;
    const last = gridSize - 1;
    if (dir % 2 === 1 && (pos[0] === 0 || pos[0] === last)) {
      val = last - pos[1];
    } else {
      val = pos[0];
    }
    const scale = ALL_SCALES[scaleId.value].scale;
    synth.triggerAttackRelease(scale[val % scale.length], "8n", Tone.now(), 0.3);
  }

  function handleCollisions(w: Record<number, Widget>): Record<number, Widget> {
    const newWidgets = JSON.parse(JSON.stringify(w)) as Record<number, Widget>;

    const posMap = new Map<string, number[]>();
    Object.values(newWidgets).forEach((widget) => {
      const key = widget.pos.join(",");
      if (!posMap.has(key)) posMap.set(key, []);
      posMap.get(key)!.push(widget.idx);
    });

    posMap.forEach((ids) => {
      if (ids.length >= 3) {
        ids.forEach((id) => {
          newWidgets[id].dir = (newWidgets[id].dir + 2) % 4;
        });
      } else if (ids.length === 2) {
        ids.forEach((id) => {
          newWidgets[id].dir = (newWidgets[id].dir + 1) % 4;
        });
      }
    });

    return newWidgets;
  }

  function tick() {
    let w = JSON.parse(JSON.stringify(widgets.value)) as Record<number, Widget>;
    w = handleCollisions(w);

    const soundedRows: number[] = [];
    const soundedCols: number[] = [];

    Object.keys(w).forEach((idx) => {
      const widget = w[Number(idx)];
      if (didHitWall(widget.pos, widget.dir)) {
        makeSound(widget.pos, widget.dir, synths.value[Number(idx)]);
        if (widget.dir % 2 === 1) {
          soundedRows.push(widget.pos[1]);
        } else {
          soundedCols.push(widget.pos[0]);
        }
      }
    });

    // Move widgets
    Object.keys(w).forEach((idx) => {
      const widget = w[Number(idx)];
      if (didHitWall(widget.pos, widget.dir)) {
        widget.dir = (widget.dir + 2) % 4;
      }

      const last = gridSize;
      if (widget.dir === 2) {
        widget.pos = [widget.pos[0], (widget.pos[1] + 1 + last) % last];
      } else if (widget.dir === 0) {
        widget.pos = [widget.pos[0], (widget.pos[1] - 1 + last) % last];
      } else if (widget.dir === 1) {
        widget.pos = [(widget.pos[0] + 1 + last) % last, widget.pos[1]];
      } else {
        widget.pos = [(widget.pos[0] - 1 + last) % last, widget.pos[1]];
      }
    });

    widgets.value = w;
    grid.value = updateGrid();

    flashCells({ rows: soundedRows, cols: soundedCols });

    return { rows: soundedRows, cols: soundedCols };
  }

  function handleCellClick(pos0: number, pos1: number) {
    const existingWidgets = Object.values(widgets.value).filter(
      (w) => w.pos[0] === pos0 && w.pos[1] === pos1
    );

    if (existingWidgets.length === 0) {
      addWidget(pos0, pos1);
    } else {
      const widget = existingWidgets[0];
      if (widget.dir < 3) {
        // Rotate
        const newWidgets = { ...widgets.value };
        newWidgets[widget.idx] = { ...newWidgets[widget.idx], dir: (widget.dir + 1) % 4 };
        widgets.value = newWidgets;
      } else {
        // Delete
        const newWidgets = { ...widgets.value };
        delete newWidgets[widget.idx];
        const newSynths = { ...synths.value };
        delete newSynths[widget.idx];
        widgets.value = newWidgets;
        synths.value = newSynths;
      }
    }
    grid.value = updateGrid();
  }

  function clear() {
    widgets.value = {};
    synths.value = {};
    grid.value = initGrid();
  }

  // Timer controls
  function setTimer() {
    unsetTimer();
    timerId = setInterval(() => {
      tick();
    }, interval.value);
    timerSet.value = true;
  }

  function unsetTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    timerSet.value = false;
  }

  function toggleTimer() {
    if (timerSet.value) {
      unsetTimer();
    } else {
      setTimer();
    }
  }

  function changeBpm(bpm: number) {
    interval.value = convertBpmToInterval(bpm);
    if (timerSet.value) {
      setTimer(); // restart with new interval
    }
  }

  function changeScale(id: number) {
    scaleId.value = id;
  }

  const bpm = ref(convertIntervalToBpm(interval.value));

  // Flashing cells for visual feedback
  const flashingCells = ref<Set<string>>(new Set());
  let flashTimeoutId: ReturnType<typeof setTimeout> | null = null;

  function flashCells(sounded: { rows: number[]; cols: number[] }) {
    const cells = new Set<string>();
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (sounded.rows.includes(r) || sounded.cols.includes(c)) {
          cells.add(`${r},${c}`);
        }
      }
    }
    flashingCells.value = cells;
    if (flashTimeoutId) clearTimeout(flashTimeoutId);
    flashTimeoutId = setTimeout(() => {
      flashingCells.value = new Set();
    }, 80);
  }

  // URL load/save
  function getURL() {
    const b = convertIntervalToBpm(interval.value);
    let widgetStr = "";
    Object.values(widgets.value).forEach((w) => {
      widgetStr += w.pos[0].toString() + w.pos[1].toString() + w.dir.toString();
    });
    return `https://marwahaha.github.io/otomata/?q=10_${scaleId.value}_${b}_${widgetStr}`;
  }

  function loadFromQuery(queryStr: string): boolean {
    const loc = queryStr.indexOf("?q=");
    if (loc === -1) return false;

    const query = queryStr.slice(loc + 3).split("_");

    if (query.length === 4) {
      // New format
      clear();
      scaleId.value = parseInt(query[1], 10) || 0;
      const b = parseInt(query[2], 10) || 150;
      interval.value = convertBpmToInterval(b);
      bpm.value = b;
      const widgetData = query[3].match(/.{3}/g) || [];
      widgetData.forEach((item) => {
        const p0 = parseInt(item[0], 10);
        const p1 = parseInt(item[1], 10);
        const d = parseInt(item[2], 10);
        addWidget(p0, p1, d);
      });
      grid.value = updateGrid();
      return true;
    } else if (query.length === 1) {
      // Old format
      clear();
      const lookup = "qwertyuiopasdfghjklzxcvbnm0123456789";
      const entries = query[0].match(/.{2}/g) || [];
      entries.forEach((item) => {
        const p0 = parseInt(item[0], 10);
        const value = lookup.indexOf(item[1]);
        const dir = value % 4;
        const p1 = Math.floor((value - dir) / 4);
        addWidget(p0, p1, dir);
      });
      scaleId.value = 0;
      interval.value = convertBpmToInterval(150);
      bpm.value = 150;
      grid.value = updateGrid();
      return true;
    }

    return false;
  }

  onUnmounted(() => {
    unsetTimer();
    reverb.dispose();
    feedback.dispose();
  });

  return {
    grid,
    widgets,
    timerSet,
    bpm,
    scaleId,
    interval,
    gridSize,
    handleCellClick,
    toggleTimer,
    clear,
    changeBpm,
    changeScale,
    getURL,
    loadFromQuery,
    tick,
    setTimer,
    unsetTimer,
    flashingCells,
  };
}
