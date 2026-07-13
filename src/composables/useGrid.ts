import * as Tone from "tone";
import { ref, computed, shallowRef, onUnmounted } from "vue";
import type { Widget } from "../types";
import { DEFAULT_GRID_SIZE, GRID_SIZE_MIN, GRID_SIZE_MAX, ALL_SCALES, convertBpmToInterval, convertIntervalToBpm } from "../constants";

export function useGrid() {
  const gridSize = ref(DEFAULT_GRID_SIZE);

  const widgets = shallowRef<Record<number, Widget>>({});
  const synths = shallowRef<Record<number, Tone.Synth>>({});
  const ctr = ref(0);
  const scaleId = ref(0);
  const selectedScaleNotes = ref(new Set(Array.from({ length: DEFAULT_GRID_SIZE }, (_, i) => i)));
  const selectedDir = ref(0); // 0-3 = direction, -1 = no selection
  const interval = ref(convertBpmToInterval(150));
  const timerSet = ref(false);
  const prePlayState = shallowRef<Record<number, { pos: [number, number]; dir: number }> | null>(null);
  const hasPrePlay = computed(() => prePlayState.value !== null);

  let timerId: ReturnType<typeof setInterval> | null = null;

  // Audio nodes — created lazily after AudioContext is started
  let reverb: Tone.Reverb | null = null;
  let feedback: Tone.FeedbackDelay | null = null;
  let audioStarted = false;

  async function ensureAudio() {
    if (audioStarted) return;
    try {
      await Tone.start();
    } catch {
      await Tone.getContext().resume();
    }

    // Create effects after context is running
    if (!reverb) {
      reverb = new Tone.Reverb(0.3).toDestination();
    }
    if (!feedback) {
      feedback = new Tone.FeedbackDelay(0.3, 0.2).toDestination();
    }

    audioStarted = true;
  }

  function generateSynth(): Tone.Synth {
    const synth = new Tone.Synth();
    if (reverb && feedback) {
      synth.connect(reverb).connect(feedback).toDestination();
    } else {
      synth.toDestination();
    }
    return synth;
  }

  function initGrid(): string[][] {
    return Array.from({ length: gridSize.value }, () => Array(gridSize.value).fill(""));
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
    const last = gridSize.value - 1;
    return (
      (dir === 0 && pos[1] === 0) ||
      (dir === 1 && pos[0] === last) ||
      (dir === 2 && pos[1] === last) ||
      (dir === 3 && pos[0] === 0)
    );
  }

  function makeSound(pos: [number, number], dir: number, synth: Tone.Synth) {
    let val = 0;
    const last = gridSize.value - 1;
    if (dir % 2 === 1 && (pos[0] === 0 || pos[0] === last)) {
      val = last - pos[1];
    } else {
      val = pos[0];
    }
    const scale = ALL_SCALES[scaleId.value].scale;
    const notes = Array.from(selectedScaleNotes.value).sort((a, b) => a - b);
    const note = notes.length > 0 ? scale[notes[val % notes.length]] : scale[0];
    synth.triggerAttackRelease(note, "8n", Tone.now(), 0.3);
  }

  function shallowCopyWidgets(src: Record<number, Widget>): Record<number, Widget> {
    const dst: Record<number, Widget> = {};
    for (const key in src) {
      const w = src[key];
      dst[key] = { idx: w.idx, pos: [w.pos[0], w.pos[1]], dir: w.dir };
    }
    return dst;
  }

  function tick() {
    const curWidgets = widgets.value;
    const curSynths = synths.value;

    // Sound detection on original state (before any movement)
    const soundedRows: number[] = [];
    const soundedCols: number[] = [];

    for (const idx in curWidgets) {
      const widget = curWidgets[idx];
      if (didHitWall(widget.pos, widget.dir)) {
        makeSound(widget.pos, widget.dir, curSynths[idx]);
        if (widget.dir & 1) {
          soundedRows.push(widget.pos[1]);
        } else {
          soundedCols.push(widget.pos[0]);
        }
      }
    }

    // Fast shallow copy — avoids JSON serialization overhead
    const next = shallowCopyWidgets(curWidgets);

    // Collision detection
    const posMap = new Map<string, number[]>();
    for (const idx in next) {
      const w = next[idx];
      const key = w.pos[0] + "," + w.pos[1];
      const arr = posMap.get(key);
      if (arr) arr.push(w.idx);
      else posMap.set(key, [w.idx]);
    }

    posMap.forEach((ids) => {
      if (ids.length >= 3) {
        for (let i = 0; i < ids.length; i++) {
          next[ids[i]].dir = (next[ids[i]].dir + 2) & 3;
        }
      } else if (ids.length === 2) {
        for (let i = 0; i < ids.length; i++) {
          next[ids[i]].dir = (next[ids[i]].dir + 1) & 3;
        }
      }
    });

    // Move widgets (mutate in-place)
    const last = gridSize.value;
    for (const idx in next) {
      const widget = next[idx];
      const p = widget.pos;

      if (didHitWall(p, widget.dir)) {
        widget.dir = (widget.dir + 2) & 3;
      }

      switch (widget.dir) {
        case 2: p[1] = (p[1] + 1) % last; break;
        case 0: p[1] = (p[1] - 1 + last) % last; break;
        case 1: p[0] = (p[0] + 1) % last; break;
        case 3: p[0] = (p[0] - 1 + last) % last; break;
      }
    }

    widgets.value = next;
    grid.value = updateGrid();
    flashCells({ rows: soundedRows, cols: soundedCols });
  }

  function handleCellClick(pos0: number, pos1: number) {
    const existingWidgets = Object.values(widgets.value).filter(
      (w) => w.pos[0] === pos0 && w.pos[1] === pos1
    );

    if (existingWidgets.length === 0) {
      if (selectedDir.value >= 0) {
        addWidget(pos0, pos1, selectedDir.value);
      }
    } else {
      // Remove all widgets at this cell
      const newWidgets = { ...widgets.value };
      const newSynths = { ...synths.value };
      existingWidgets.forEach((w) => {
        delete newWidgets[w.idx];
        delete newSynths[w.idx];
      });
      widgets.value = newWidgets;
      synths.value = newSynths;
    }
    grid.value = updateGrid();
  }

  function setSelectedDir(dir: number) {
    selectedDir.value = selectedDir.value === dir ? -1 : dir;
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

  // toggleTimer is async so ensureAudio runs with user gesture context intact
  async function toggleTimer() {
    if (!audioStarted) {
      await ensureAudio();
    }
    if (timerSet.value) {
      unsetTimer();
    } else {
      // Save pre-play snapshot
      const snap: Record<number, { pos: [number, number]; dir: number }> = {};
      for (const idx in widgets.value) {
        const w = widgets.value[idx];
        snap[idx] = { pos: [w.pos[0], w.pos[1]], dir: w.dir };
      }
      prePlayState.value = snap;
      setTimer();
    }
  }

  function restorePrePlay() {
    if (!prePlayState.value || timerSet.value) return;
    const snap = prePlayState.value;
    // Remove current widgets not in snapshot
    const newWidgets: Record<number, Widget> = {};
    const newSynths: Record<number, Tone.Synth> = {};
    for (const idx in snap) {
      const s = snap[idx];
      newWidgets[idx] = { idx: Number(idx), pos: [s.pos[0], s.pos[1]], dir: s.dir };
      newSynths[idx] = synths.value[idx] || generateSynth();
    }
    widgets.value = newWidgets;
    synths.value = newSynths;
    grid.value = updateGrid();
    prePlayState.value = null;
  }

  function changeBpm(bpm: number) {
    interval.value = convertBpmToInterval(bpm);
    if (timerSet.value) {
      setTimer();
    }
  }

  function changeScale(id: number) {
    scaleId.value = id;
    const scale = ALL_SCALES[id].scale;
    const count = Math.min(gridSize.value, scale.length);
    selectedScaleNotes.value = new Set(Array.from({ length: count }, (_, i) => i));
  }

  function toggleScaleNote(index: number) {
    const notes = new Set(selectedScaleNotes.value);
    if (notes.has(index)) {
      notes.delete(index);
    } else {
      if (notes.size >= gridSize.value) {
        // Remove first selected note to make room
        const first = Array.from(notes).sort((a, b) => a - b)[0];
        notes.delete(first);
      }
      notes.add(index);
    }
    selectedScaleNotes.value = notes;
  }

  function changeGridSize(size: number) {
    const clamped = Math.max(GRID_SIZE_MIN, Math.min(GRID_SIZE_MAX, size));
    if (clamped === gridSize.value) return;
    unsetTimer();
    gridSize.value = clamped;
    // Trim selected notes if too many
    const current = Array.from(selectedScaleNotes.value).sort((a, b) => a - b);
    if (current.length > clamped) {
      selectedScaleNotes.value = new Set(current.slice(0, clamped));
    }
    clear();
  }

  const bpm = computed(() => convertIntervalToBpm(interval.value));

  const scaleNotes = computed(() => {
    const scale = ALL_SCALES[scaleId.value].scale;
    const indices = Array.from(selectedScaleNotes.value).sort((a, b) => a - b);
    return indices.map(i => scale[i]);
  });

  // Flashing cells
  const flashingCells = ref<Set<string>>(new Set());
  let flashTimeoutId: ReturnType<typeof setTimeout> | null = null;

  function flashCells(sounded: { rows: number[]; cols: number[] }) {
    const cells = new Set<string>();
    for (let r = 0; r < gridSize.value; r++) {
      for (let c = 0; c < gridSize.value; c++) {
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
  // File save/load
  function buildSaveData() {
    const current: Record<string, { pos: [number, number]; dir: number }> = {};
    for (const idx in widgets.value) {
      const w = widgets.value[idx];
      current[idx] = { pos: [w.pos[0], w.pos[1]], dir: w.dir };
    }
    const pre: Record<string, { pos: [number, number]; dir: number }> | null = prePlayState.value
      ? { ...prePlayState.value }
      : null;
    return {
      v: 1,
      bpm: convertIntervalToBpm(interval.value),
      scaleId: scaleId.value,
      gridSize: gridSize.value,
      selectedNotes: Array.from(selectedScaleNotes.value).sort((a, b) => a - b),
      current,
      prePlay: pre,
    };
  }

  function saveToFile() {
    const data = JSON.stringify(buildSaveData(), null, 2);
    // Try Tauri native dialog, fall back to browser download
    const tryTauri = async () => {
      const { save } = await import("@tauri-apps/plugin-dialog");
      const { writeTextFile } = await import("@tauri-apps/plugin-fs");
      const path = await save({ filters: [{ name: "JSON", extensions: ["json"] }], defaultPath: "otomata-session.json" });
      if (!path) return;
      await writeTextFile(path, data);
    };
    tryTauri().catch(() => {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "otomata-session.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function loadFromFilePrompt() {
    const tryTauri = async () => {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const { readTextFile } = await import("@tauri-apps/plugin-fs");
      const selected = await open({ filters: [{ name: "JSON", extensions: ["json"] }] });
      if (!selected) return;
      const content = await readTextFile(selected as string);
      if (!loadFromFile(content)) alert("Invalid save file");
    };
    tryTauri().catch(() => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          if (!loadFromFile(reader.result as string)) alert("Invalid save file");
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }

  function loadFromFile(content: string): boolean {
    try {
      const data = JSON.parse(content);
      if (!data || data.v !== 1) return false;
      unsetTimer();
      scaleId.value = data.scaleId ?? 0;
      gridSize.value = data.gridSize ?? DEFAULT_GRID_SIZE;
      interval.value = convertBpmToInterval(data.bpm ?? 150);
      selectedScaleNotes.value = new Set(data.selectedNotes ?? []);
      const newWidgets: Record<number, Widget> = {};
      const newSynths: Record<number, Tone.Synth> = {};
      let maxIdx = 0;
      for (const idx in data.current) {
        const w = data.current[idx];
        const i = Number(idx);
        newWidgets[i] = { idx: i, pos: [w.pos[0], w.pos[1]], dir: w.dir };
        newSynths[i] = generateSynth();
        if (i > maxIdx) maxIdx = i;
      }
      widgets.value = newWidgets;
      synths.value = newSynths;
      ctr.value = maxIdx + 1;
      prePlayState.value = data.prePlay || null;
      grid.value = updateGrid();
      return true;
    } catch {
      return false;
    }
  }

  onUnmounted(() => {
    unsetTimer();
    reverb?.dispose();
    feedback?.dispose();
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
    toggleScaleNote,
    changeGridSize,
    tick,
    setTimer,
    unsetTimer,
    flashingCells,
    selectedDir,
    setSelectedDir,
    scaleNotes,
    selectedScaleNotes,
    hasPrePlay,
    restorePrePlay,
    saveToFile,
    loadFromFilePrompt,
  };
}
