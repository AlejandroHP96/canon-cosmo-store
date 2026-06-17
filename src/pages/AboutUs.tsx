import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

type TeamMember = {
    name: string;
    role: string;
    types: string[];
    abilities: string[];
    bio: string;
    stats: string;
    initials: string;
    avatarBg: string;
    avatarImg?: string;
    legendaryCreature: string;
    abilityLabel: string;
    proxy: string;
};

const cardStyle = {
    background: 'linear-gradient(160deg, #111a6a 0%, #0a1045 100%)',
    border: '3px solid #5a5aaa',
    boxShadow: '0 0 28px rgba(80,80,200,0.4), inset 0 0 16px rgba(0,0,80,0.6)',
    fontFamily: 'monospace',
};

const CardInner = ({ member, large = false }: { member: TeamMember; large?: boolean }) => (
    <>
        {/* Top: portrait + name/type */}
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
                {member.avatarImg
                    ? <img src={member.avatarImg} alt={member.name} className="w-full h-full object-cover" />
                    : member.initials
                }
            </div>
            <div className="flex flex-col justify-center gap-1 pt-1 min-w-0">
                <p className={`text-white font-bold leading-tight tracking-wide ${large ? 'text-2xl' : 'text-base'}`}>
                    {member.name},<br />
                    <span className={`text-[#bec2ff] font-normal ${large ? 'text-lg' : 'text-sm'}`}>{member.role}</span>
                </p>
                <p className={`text-[#00ccaa] tracking-wide leading-tight mt-0.5 ${large ? 'text-sm' : 'text-[11px]'}`}>{member.legendaryCreature}</p>
                <p className={`text-[#bec2ff]/70 leading-tight ${large ? 'text-sm' : 'text-[11px]'}`}>{member.types.join(' / ')}</p>
            </div>
        </div>

        {/* Separator */}
        <div className={`${large ? 'mx-5 mt-4' : 'mx-3 mt-3'} border-t border-[#5a5aaa]/40`} />

        {/* Bio text box */}
        <div
            className={`${large ? 'mx-5 my-4 p-5' : 'mx-3 my-3 p-4'} ${large ? '' : 'min-h-[260px]'}`}
            style={{ border: '1px solid #4a4aaa', background: '#060c38' }}>
            {member.bio.split('\n\n').map((paragraph, i) => (
                <p key={i} className={`text-[#d0d4ff] leading-relaxed ${i > 0 ? 'mt-3' : ''} ${large ? 'text-sm' : 'text-[11px]'}`}>
                    {paragraph}
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

const TeamModal = ({ member, onClose }: { member: TeamMember; onClose: () => void }) => (
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

const AboutUs = () => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<TeamMember | null>(null);

    const TEAM: TeamMember[] = [
        {
            name: 'TONI',
            role: t('aboutUs.team.toni.role'),
            types: [t('aboutUs.team.toni.type1'), t('aboutUs.team.toni.type2')],
            abilities: [t('aboutUs.team.toni.ability1'), t('aboutUs.team.toni.ability2'), t('aboutUs.team.toni.ability3')],
            bio: t('aboutUs.team.toni.bio'),
            stats: '5/3',
            initials: 'T',
            avatarBg: '#1a2870',
            avatarImg: '/toni.png',
            legendaryCreature: t('aboutUs.legendaryCreature'),
            abilityLabel: t('aboutUs.ability'),
            proxy: t('aboutUs.proxy'),
        },
        {
            name: 'JONAY',
            role: t('aboutUs.team.jonay.role'),
            types: [t('aboutUs.team.jonay.type1'), t('aboutUs.team.jonay.type2')],
            abilities: [t('aboutUs.team.jonay.ability1'), t('aboutUs.team.jonay.ability2'), t('aboutUs.team.jonay.ability3')],
            bio: t('aboutUs.team.jonay.bio'),
            stats: '3/5',
            initials: 'J',
            avatarBg: '#2a1870',
            avatarImg: '/jonay.png',
            legendaryCreature: t('aboutUs.legendaryCreature'),
            abilityLabel: t('aboutUs.ability'),
            proxy: t('aboutUs.proxy'),
        },
    ];

    return (
        <section className="max-w-5xl mx-auto px-3 sm:px-6 py-10 pb-20 text-center">
            <SEO
                title={t('aboutUs.title')}
                description="Conoce Cañón Cosmo Store, tu tienda especializada en trading cards, Funko Pop y coleccionables."
                path="/aboutus"
            />

            <div className="mb-12">
                <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">
                    {t('aboutUs.subtitle')}
                </p>
                <h2 className="font-headline font-bold text-2xl md:text-3xl uppercase tracking-widest text-on-surface">
                    {t('aboutUs.title')}
                </h2>
                <div className="h-px bg-primary/30 mt-4" />
                <p className="text-on-surface-variant text-sm leading-relaxed font-body mt-4 max-w-2xl mx-auto">
                    {t('aboutUs.description')}
                </p>
            </div>

            <div className="flex flex-wrap gap-10 justify-center">
                {TEAM.map((member) => (
                    <TeamCard key={member.name} member={member} onClick={() => setSelected(member)} />
                ))}
            </div>

            {selected && <TeamModal member={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};

export default AboutUs;
