import type { TeamMember } from './team';
import { cardStyle } from './cardStyle';

/** Contenido de la carta. `large` es la versión del modal. */
export const CardInner = ({ member, large = false }: { member: TeamMember; large?: boolean }) => (
    <>
        <div className={`flex gap-3 ${large ? 'p-5 pb-0' : 'p-3 pb-0'}`}>
            <div
                className="shrink-0 flex items-center justify-center font-bold text-[#bec2ff] overflow-hidden"
                style={{
                    width: large ? 180 : 120,
                    height: large ? 180 : 120,
                    fontSize: large ? '3rem' : '2.25rem',
                    background: member.avatarBg,
                    border: '2px solid #5a5aaa',
                    boxShadow: 'inset 0 0 8px rgba(0,0,100,0.8)',
                }}>
                {member.avatarImg ? (
                    <img
                        src={member.avatarImg}
                        alt={member.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    member.initials
                )}
            </div>
            <div className="flex flex-col justify-center gap-1 pt-1 min-w-0">
                <p
                    className={`text-white font-bold leading-tight tracking-wide ${
                        large ? 'text-2xl' : 'text-base'
                    }`}>
                    {member.name},<br />
                    <span className={`text-[#bec2ff] font-normal ${large ? 'text-lg' : 'text-sm'}`}>
                        {member.role}
                    </span>
                </p>
                <p
                    className={`text-[#00ccaa] tracking-wide leading-tight mt-0.5 ${
                        large ? 'text-sm' : 'text-[11px]'
                    }`}>
                    {member.legendaryCreature}
                </p>
                <p
                    className={`text-[#bec2ff]/70 leading-tight ${large ? 'text-sm' : 'text-[11px]'}`}>
                    {member.types.join(' / ')}
                </p>
            </div>
        </div>

        <div className={`${large ? 'mx-5 mt-4' : 'mx-3 mt-3'} border-t border-[#5a5aaa]/40`} />

        <div
            className={`${large ? 'mx-5 my-4 p-5' : 'mx-3 my-3 p-4'} ${large ? '' : 'min-h-[260px]'}`}
            style={{ border: '1px solid #4a4aaa', background: '#060c38' }}>
            {member.bio.split('\n\n').map((parrafo, i) => (
                <p
                    key={i}
                    className={`text-[#d0d4ff] leading-relaxed ${i > 0 ? 'mt-3' : ''} ${
                        large ? 'text-sm' : 'text-[11px]'
                    }`}>
                    {parrafo}
                </p>
            ))}
        </div>
    </>
);

const TeamCard = ({ member, onClick }: { member: TeamMember; onClick: () => void }) => (
    <div
        className="w-full max-w-[360px] shrink-0 select-none cursor-pointer hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
        style={cardStyle}
        onClick={onClick}>
        <CardInner member={member} />
    </div>
);

export default TeamCard;
