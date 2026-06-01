import { useEffect, useRef, useState } from 'react';

const SPRITE_WIDTH = 48;
const WALK_SPEED   = 200;  // px/s
const WALK_FRAME_MS  = 300;  // ms per walk frame
const REST_FRAME_MS  = 450;  // ms per rest frame
const WALK_DURATION  = 5000; // ms walking before resting
const REST_DURATION  = 2500; // ms resting

// Frame indices × SPRITE_WIDTH = background-position-x offset
const WALK_FRAMES = [0, 1];  // frames 1-2 of row 1
const REST_FRAMES = [3, 4];  // frames 4-5 of row 1 (moogle lying down + jump)

type Mode = 'walking' | 'resting';

const CaitSithSprite = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({
        pos: 0,
        dir: 1 as 1 | -1,
        frameIdx: 0,       // index into current frame array
        lastFrameTime: 0,
        mode: 'walking' as Mode,
        modeStartTime: 0,
    });
    const rafRef = useRef<number>(0);
    const [render, setRender] = useState({ pos: 0, dir: 1 as 1 | -1, frameIdx: 0, mode: 'walking' as Mode });

    useEffect(() => {
        let lastTime: number | null = null;

        const tick = (timestamp: number) => {
            const s = stateRef.current;
            const container = containerRef.current;
            if (!container) { rafRef.current = requestAnimationFrame(tick); return; }

            const maxPos = container.offsetWidth - SPRITE_WIDTH;

            if (lastTime !== null) {
                const dt = (timestamp - lastTime) / 1000;
                const modeElapsed = timestamp - s.modeStartTime;

                if (s.mode === 'walking') {
                    s.pos += s.dir * WALK_SPEED * dt;
                    if (s.pos >= maxPos) { s.pos = maxPos; s.dir = -1; }
                    else if (s.pos <= 0) { s.pos = 0;      s.dir =  1; }

                    if (timestamp - s.lastFrameTime >= WALK_FRAME_MS) {
                        s.frameIdx = 1 - s.frameIdx;
                        s.lastFrameTime = timestamp;
                    }

                    if (modeElapsed >= WALK_DURATION) {
                        s.mode = 'resting';
                        s.modeStartTime = timestamp;
                        s.frameIdx = 0;
                        s.lastFrameTime = timestamp;
                    }
                } else {
                    if (timestamp - s.lastFrameTime >= REST_FRAME_MS) {
                        s.frameIdx = 1 - s.frameIdx;
                        s.lastFrameTime = timestamp;
                    }

                    if (modeElapsed >= REST_DURATION) {
                        s.mode = 'walking';
                        s.modeStartTime = timestamp;
                        s.frameIdx = 0;
                        s.lastFrameTime = timestamp;
                    }
                }

                setRender({ pos: s.pos, dir: s.dir, frameIdx: s.frameIdx, mode: s.mode });
            }

            lastTime = timestamp;
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const frames = render.mode === 'walking' ? WALK_FRAMES : REST_FRAMES;
    const bgX = -(frames[render.frameIdx] * SPRITE_WIDTH);

    return (
        <div ref={containerRef} className="hidden sm:block flex-1 relative overflow-hidden mx-4 h-10">
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    top: '-8px',
                    left: `${render.pos}px`,
                    width: `${SPRITE_WIDTH}px`,
                    height: '50px',
                    backgroundImage: "url('/caitsith-walk.webp')",
                    backgroundSize: '288px 150px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${bgX}px 0px`,
                    imageRendering: 'pixelated',
                    transform: `scaleX(${-render.dir})`,
                }}
            />
        </div>
    );
};

export default CaitSithSprite;
