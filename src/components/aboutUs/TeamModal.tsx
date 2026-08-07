import type { TeamMember } from './team';
import { CardInner } from './TeamCard';
import { cardStyle } from './cardStyle';
import Modal from '../Modal';

type Props = {
    member: TeamMember;
    onClose: () => void;
};

const TeamModal = ({ member, onClose }: Props) => (
    <Modal
        onClose={onClose}
        title={member.name}
        backdropClass="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        panelClass="w-full max-w-lg select-none relative"
        panelStyle={cardStyle}>
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-[#bec2ff]/60 hover:text-white transition-colors z-10"
                style={{ fontFamily: 'monospace', fontSize: 18 }}>
                ✕
            </button>
            <CardInner member={member} large />
    </Modal>
);

export default TeamModal;
