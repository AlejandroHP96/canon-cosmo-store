import { useEffect, useRef, useState } from 'react';

const SPRITE_WIDTH = 48;
const WALK_SPEED = 70;    // px/s
const FRAME_MS = 300;     // ms per walk frame

const CaitSithSprite = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({ pos: 0, dir: 1 as 1 | -1, frame: 0, lastFrameTime: 0 });
    const rafRef = useRef<number>(0);
    const [render, setRender] = useState({ pos: 0, dir: 1 as 1 | -1, frame: 0 });

    useEffect(() => {
        let lastTime: number | null = null;

        const tick = (timestamp: number) => {
            const s = stateRef.current;
            const container = containerRef.current;
            if (!container) { rafRef.current = requestAnimationFrame(tick); return; }

            const maxPos = container.offsetWidth - SPRITE_WIDTH;

            if (lastTime !== null) {
                const dt = (timestamp - lastTime) / 1000;
                s.pos += s.dir * WALK_SPEED * dt;

                if (s.pos >= maxPos) { s.pos = maxPos; s.dir = -1; }
                else if (s.pos <= 0) { s.pos = 0;      s.dir =  1; }

                if (timestamp - s.lastFrameTime >= FRAME_MS) {
                    s.frame = 1 - s.frame;
                    s.lastFrameTime = timestamp;
                }

                setRender({ pos: s.pos, dir: s.dir, frame: s.frame });
            }

            lastTime = timestamp;
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

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
                    backgroundPosition: `${render.frame === 0 ? 0 : -SPRITE_WIDTH}px 0px`,
                    imageRendering: 'pixelated',
                    transform: `scaleX(${render.dir})`,
                }}
            />
        </div>
    );
};

export default CaitSithSprite;
