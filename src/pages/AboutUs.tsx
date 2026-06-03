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

const TeamCard = ({ member }: { member: TeamMember }) => (
    <div
        className="w-[360px] shrink-0 select-none"
        style={{
            background: 'linear-gradient(160deg, #111a6a 0%, #0a1045 100%)',
            border: '3px solid #5a5aaa',
            boxShadow: '0 0 28px rgba(80,80,200,0.4), inset 0 0 16px rgba(0,0,80,0.6)',
            fontFamily: 'monospace',
        }}>

        {/* Top: portrait + name/type */}
        <div className="flex gap-3 p-3 pb-0">
            <div
                className="shrink-0 flex items-center justify-center text-4xl font-bold text-[#bec2ff] overflow-hidden"
                style={{
                    width: 120,
                    height: 120,
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
                <p className="text-white font-bold text-base leading-tight tracking-wide">
                    {member.name},<br />
                    <span className="text-[#bec2ff] font-normal text-sm">{member.role}</span>
                </p>
                <p className="text-[#00ccaa] text-[11px] tracking-wide leading-tight mt-0.5">{member.legendaryCreature}</p>
                <p className="text-[#bec2ff]/70 text-[11px] leading-tight">{member.types.join(' / ')}</p>
            </div>
        </div>

        {/* Separator */}
        <div className="mx-3 mt-3 border-t border-[#5a5aaa]/40" />

        {/* Bio text box */}
        <div className="mx-3 my-3 p-4 min-h-[260px]" style={{ border: '1px solid #4a4aaa', background: '#060c38' }}>
            {member.bio.split('\n\n').map((paragraph, i) => (
                <p key={i} className={`text-[11px] text-[#d0d4ff] leading-relaxed ${i > 0 ? 'mt-2' : ''}`}>
                    {paragraph}
                </p>
            ))}
        </div>
    </div>
);

const AboutUs = () => {
    const { t } = useTranslation();

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
            legendaryCreature: t('aboutUs.legendaryCreature'),
            abilityLabel: t('aboutUs.ability'),
            proxy: t('aboutUs.proxy'),
        },
    ];

    return (
        <section className="max-w-5xl mx-auto px-6 py-10 pb-20 text-center">
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

            <div className="flex flex-wrap gap-16 justify-center">
                {TEAM.map((member) => (
                    <TeamCard key={member.name} member={member} />
                ))}
            </div>
        </section>
    );
};

export default AboutUs;
