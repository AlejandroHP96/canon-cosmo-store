import type { TeamMember } from './team';
import { CardInner } from './TeamCard';
import { cardStyle } from './cardStyle';

type Props = {
    member: TeamMember;
    onClose: () => void;
};

const TeamModal = ({ member, onClose }: Props) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}>
        <div
            className="w-full max-w-lg select-none relative"
            style={cardStyle}
            onClick={(e) => e.stopPropagation()}>
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-[#bec2ff]/60 hover:text-white transition-colors z-10"
                style={{ fontFamily: 'monospace', fontSize: 18 }}>
                ✕
            </button>
            <CardInner member={member} large />
        </div>
    </div>
);

export default TeamModal;
