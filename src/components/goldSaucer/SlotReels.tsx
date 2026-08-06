import { SYMBOLS } from './slotMachine';

type Props = {
    reels: number[];
    stopped: boolean[];
    spinning: boolean;
};

const SlotReels = ({ reels, stopped, spinning }: Props) => (
    <div className="flex gap-2 sm:gap-4 justify-center mb-8">
        {reels.map((symIdx, i) => (
            <div
                key={i}
                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 bg-[#000120] transition-all duration-200 ${
                    stopped[i] && !spinning ? 'border-[#c8a800]' : 'border-[#c8a800]/30'
                }`}>
                <span
                    className={`font-headline font-bold text-4xl select-none transition-all duration-75 ${
                        spinning && !stopped[i] ? 'blur-[1.5px] scale-110' : 'blur-0 scale-100'
                    }`}
                    style={{ color: SYMBOLS[symIdx].color }}>
                    {SYMBOLS[symIdx].char}
                </span>
            </div>
        ))}
    </div>
);

export default SlotReels;
