import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gamepad2, RotateCcw, Trophy } from 'lucide-react';

const N = 8;
type Cell = [number, number];

const SHAPES: Cell[][] = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1], [1, 2]],
  [[0, 2], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 0]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [1, 1], [2, 1], [2, 0]],
];

const COLORS = ['var(--primary)', '#8b5cf6', '#22c55e', '#ff7a1a', '#ec4899', '#eab308'];

interface Piece {
  cells: Cell[];
  color: number;
}

const randPiece = (): Piece => ({
  cells: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  color: Math.floor(Math.random() * COLORS.length),
});

const idx = (r: number, c: number) => r * N + c;

function fits(grid: number[], cells: Cell[], row: number, col: number): boolean {
  return cells.every(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    return r >= 0 && r < N && c >= 0 && c < N && grid[idx(r, c)] === 0;
  });
}

function anyFit(grid: number[], cells: Cell[]): boolean {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (fits(grid, cells, r, c)) return true;
    }
  }
  return false;
}

function clearLines(grid: number[]): { grid: number[]; lines: number } {
  const fullRows: number[] = [];
  const fullCols: number[] = [];
  for (let r = 0; r < N; r++) {
    if (Array.from({ length: N }, (_, c) => grid[idx(r, c)]).every(Boolean)) fullRows.push(r);
  }
  for (let c = 0; c < N; c++) {
    if (Array.from({ length: N }, (_, r) => grid[idx(r, c)]).every(Boolean)) fullCols.push(c);
  }
  if (fullRows.length === 0 && fullCols.length === 0) return { grid, lines: 0 };
  const next = grid.slice();
  for (const r of fullRows) for (let c = 0; c < N; c++) next[idx(r, c)] = 0;
  for (const c of fullCols) for (let r = 0; r < N; r++) next[idx(r, c)] = 0;
  return { grid: next, lines: fullRows.length + fullCols.length };
}

interface Drag {
  trayIndex: number;
  cells: Cell[];
  color: number;
  x: number;
  y: number;
  offX: number;
  offY: number;
  row: number;
  col: number;
  valid: boolean;
  rows: number;
  cols: number;
}

function pieceBounds(cells: Cell[]): { rows: number; cols: number } {
  return {
    rows: Math.max(...cells.map(([r]) => r)) + 1,
    cols: Math.max(...cells.map(([, c]) => c)) + 1,
  };
}

export function BlockBlast() {
  const [grid, setGrid] = useState<number[]>(() => Array(N * N).fill(0));
  const [tray, setTray] = useState<(Piece | null)[]>(() => [randPiece(), randPiece(), randPiece()]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem('anida:blockblast-best') || 0);
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(36);
  // Зеркала для обработчиков (без вложенных сеттеров — их StrictMode дублирует)
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const trayRef = useRef(tray);
  trayRef.current = tray;
  const dragRef = useRef<Drag | null>(null);
  dragRef.current = drag;

  useEffect(() => {
    const measure = () => {
      const el = boardRef.current;
      if (el) setCell(el.clientWidth / N);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      try {
        localStorage.setItem('anida:blockblast-best', String(score));
      } catch {}
    }
  }, [score, best]);

  const restart = useCallback(() => {
    setGrid(Array(N * N).fill(0));
    setTray([randPiece(), randPiece(), randPiece()]);
    setScore(0);
    setGameOver(false);
    setDrag(null);
  }, []);

  const startDrag = (trayIndex: number, e: React.PointerEvent) => {
    const p = tray[trayIndex];
    if (!p || gameOver) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { rows, cols } = pieceBounds(p.cells);
    e.preventDefault();
    setDrag({
      trayIndex,
      cells: p.cells,
      color: p.color,
      x: e.clientX,
      y: e.clientY,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
      row: -99,
      col: -99,
      valid: false,
      rows,
      cols,
    });
  };

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => {
      const board = boardRef.current?.getBoundingClientRect();
      const d = dragRef.current;
      if (!board || !d) return;
      const scale = cell / mini;
      const left = e.clientX - d.offX * scale;
      const top = e.clientY - d.offY * scale;
      const col = Math.round((left - board.left) / cell);
      const row = Math.round((top - board.top) / cell);
      const valid = fits(gridRef.current, d.cells, row, col);
      setDrag({ ...d, x: e.clientX, y: e.clientY, row, col, valid });
    };
    const onUp = () => {
      const d = dragRef.current;
      setDrag(null);
      if (!d || !d.valid) return;
      const next = gridRef.current.slice();
      for (const [dr, dc] of d.cells) next[idx(d.row + dr, d.col + dc)] = d.color + 1;
      const { grid: cleared, lines } = clearLines(next);
      setGrid(cleared);
      setScore((s) => s + d.cells.length + lines * lines * N);
      setTray((t) => {
        const nt = t.slice();
        nt[d.trayIndex] = null;
        return nt.every((x) => x === null) ? [randPiece(), randPiece(), randPiece()] : nt;
      });
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    window.addEventListener('pointercancel', onUp, { once: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag, cell]);

  // Конец игры: после каждого хода проверяем, влезает ли хоть что-то
  useEffect(() => {
    if (gameOver) return;
    const alive = tray.some((p) => p && anyFit(grid, p.cells));
    if (!alive) setGameOver(true);
  }, [grid, tray, gameOver]);

  const preview = useMemo(() => {
    if (!drag || !drag.valid) return new Set<number>();
    const s = new Set<number>();
    for (const [dr, dc] of drag.cells) s.add(idx(drag.row + dr, drag.col + dc));
    return s;
  }, [drag]);

  const gap = 3;
  const mini = 22;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto', touchAction: 'pan-y' }}>
      <div className="brutal-sm" style={{ background: 'var(--surface)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 900, fontSize: 16 }}>
          <Gamepad2 size={18} color="var(--primary)" /> Block Blast
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)' }}>
          <Trophy size={14} /> {best}
        </span>
        <span style={{ fontSize: 15, fontWeight: 900 }}>Очки: {score}</span>
        <button onClick={restart} className="btn-brutal" title="Заново" style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'var(--surface-secondary)', color: 'var(--text)' }}>
          <RotateCcw size={16} />
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          ref={boardRef}
          className="brutal"
          style={{
            background: 'var(--surface)',
            padding: 8,
            display: 'grid',
            gridTemplateColumns: `repeat(${N}, 1fr)`,
            gap,
            touchAction: 'none',
          }}
        >
          {grid.map((v, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 6,
                background: v
                  ? COLORS[(v - 1) % COLORS.length]
                  : preview.has(i)
                    ? drag?.valid
                      ? 'rgba(34,197,94,.45)'
                      : 'rgba(229,72,77,.45)'
                    : 'var(--surface-secondary)',
                border: '1px solid var(--border)',
              }}
            />
          ))}
        </div>

        {gameOver && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.6)', borderRadius: 'var(--radius)', zIndex: 5 }}>
            <div className="brutal" style={{ background: 'var(--surface)', padding: 24, textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 20 }}>Игра окончена</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
                Очки: {score} · Рекорд: {best}
              </div>
              <button onClick={restart} className="btn-brutal" style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: '#fff', fontWeight: 800, padding: '10px 20px', fontSize: 14 }}>
                <RotateCcw size={15} /> Ещё раз
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="brutal-sm" style={{ background: 'var(--surface)', padding: 14, display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: 110, touchAction: 'none' }}>
        {tray.map((p, i) => {
          if (!p) return <div key={i} style={{ width: 70 }} />;
          const b = pieceBounds(p.cells);
          const dragging = drag?.trayIndex === i;
          return (
            <div
              key={i}
              onPointerDown={(e) => startDrag(i, e)}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${b.cols}, ${mini}px)`,
                gap: 2,
                opacity: dragging ? 0.3 : 1,
                cursor: 'grab',
                touchAction: 'none',
                padding: 8,
              }}
            >
              {Array.from({ length: b.rows * b.cols }, (_, k) => {
                const r = Math.floor(k / b.cols);
                const c = k % b.cols;
                const on = p.cells.some(([dr, dc]) => dr === r && dc === c);
                return (
                  <div
                    key={k}
                    style={{
                      width: mini,
                      height: mini,
                      borderRadius: 5,
                      background: on ? COLORS[p.color % COLORS.length] : 'transparent',
                      border: on ? '1px solid var(--border)' : 'none',
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {drag && (
        <div
          style={{
            position: 'fixed',
            left: drag.x - drag.offX * (cell / mini),
            top: drag.y - drag.offY * (cell / mini),
            display: 'grid',
            gridTemplateColumns: `repeat(${drag.cols}, ${cell - gap}px)`,
            gap,
            pointerEvents: 'none',
            zIndex: 100,
            opacity: 0.9,
          }}
        >
          {Array.from({ length: drag.rows * drag.cols }, (_, k) => {
            const r = Math.floor(k / drag.cols);
            const c = k % drag.cols;
            const on = drag.cells.some(([dr, dc]) => dr === r && dc === c);
            return (
              <div
                key={k}
                style={{
                  width: cell - gap,
                  height: cell - gap,
                  borderRadius: 6,
                  background: on ? COLORS[drag.color % COLORS.length] : 'transparent',
                  border: on ? '1px solid var(--border)' : 'none',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
