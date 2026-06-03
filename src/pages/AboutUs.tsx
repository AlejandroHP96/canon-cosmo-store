import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

type TeamMember = {
    name: string;
    role: string;
    level: number;
    dots: string[];
    types: string[];
    abilities: string[];
    bio: string;
    stats: string;
    initials: string;
    avatarBg: string;
};

const TEAM: TeamMember[] = [
    {
        name: 'ALEJANDRO',
        role: 'Fundador',
        level: 4,
        dots: ['#cc3333', '#3355cc', '#ccaa00', '#33aa55'],
        types: ['Store Owner', 'TCG Champion'],
        abilities: ['Pokémon', 'Torneos', 'Colección'],
        bio: 'Al entrar en juego: busca en tu biblioteca hasta 3 cartas TCG y añádelas a tu mano.\n\nCuando Alejandro declara ataque, puedes revelar una carta Pokémon de tu mano. Si lo haces, Alejandro recibe +2/+0 hasta el final del turno.',
        stats: '5/3',
        initials: 'AH',
        avatarBg: '#1a2870',
    },
    {
        name: 'PATRICIA',
        role: 'Co-Fundadora',
        level: 4,
        dots: ['#aa33cc', '#33aa55', '#ccaa00', '#cc3333'],
        types: ['Store Owner', 'Lore Keeper'],
        abilities: ['Funko Pop', 'Rareza', 'Comunidad'],
        bio: 'Siempre que Patricia entra en juego, busca en tu biblioteca el coleccionable más raro y añádelo a tu vitrina.\n\nSi controlas 5 o más objetos únicos, los rivales no pueden robar cartas adicionales.',
        stats: '3/5',
        initials: 'PS',
        avatarBg: '#2a1870',
    },
];

const TeamCard = ({ member }: { member: TeamMember }) => (
    <div
        className="w-[280px] shrink-0 select-none"
        style={{
            background: 'linear-gradient(160deg, #111a6a 0%, #0a1045 100%)',
            border: '3px solid #5a5aaa',
            boxShadow: '0 0 20px rgba(80,80,200,0.4), inset 0 0 12px rgba(0,0,80,0.6)',
            fontFamily: 'monospace',
        }}>

        {/* Top: portrait + name/mana/type */}
        <div className="flex gap-2 p-2 pb-0">
            <div
                className="shrink-0 flex items-center justify-center text-2xl font-bold text-[#bec2ff]"
                style={{
                    width: 88,
                    height: 88,
                    background: member.avatarBg,
                    border: '2px solid #5a5aaa',
                    boxShadow: 'inset 0 0 8px rgba(0,0,100,0.8)',
                }}>
                {member.initials}
            </div>
            <div className="flex flex-col justify-center gap-0.5 pt-1 min-w-0">
                <p className="text-white font-bold text-[13px] leading-tight tracking-wide">
                    {member.name},<br />
                    <span className="text-[#bec2ff] font-normal text-[11px]">{member.role}</span>
                </p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[#bec2ff] text-[9px]">Cmc. {member.level}</span>
                    {member.dots.map((color, i) => (
                        <span key={i} className="w-3 h-3 rounded-full shrink-0" style={{ background: color, border: '1px solid rgba(255,255,255,0.3)' }} />
                    ))}
                </div>
                <p className="text-[#00ccaa] text-[9px] tracking-wide leading-tight mt-0.5">Legendary Creature</p>
                <p className="text-[#bec2ff]/70 text-[9px] leading-tight">{member.types.join(' / ')}</p>
            </div>
        </div>

        {/* Separator */}
        <div className="mx-2 mt-2 border-t border-[#5a5aaa]/40" />

        {/* Abilities — FF7 menu style */}
        <div className="flex items-start gap-1 px-2 py-2">
            <span className="text-[9px] text-[#bec2ff]/60 italic mt-1.5 shrink-0 whitespace-nowrap">
                {member.name.charAt(0) + member.name.slice(1).toLowerCase()}'s ability ──►
            </span>
            <div style={{ border: '1px solid #5a5aaa', background: '#0e1660' }} className="flex flex-col min-w-[100px]">
                {member.abilities.map((ab, i) => (
                    <span
                        key={i}
                        className="text-[11px] px-3 py-[3px] tracking-wide"
                        style={{
                            background: i === 0 ? '#2a3a9a' : 'transparent',
                            color: i === 0 ? '#ffffff' : 'rgba(190,194,255,0.6)',
                            borderBottom: i < member.abilities.length - 1 ? '1px solid rgba(90,90,170,0.3)' : 'none',
                        }}>
                        {ab}
                    </span>
                ))}
            </div>
        </div>

        {/* Bio text box */}
        <div className="mx-2 mb-2 p-2" style={{ border: '1px solid #4a4aaa', background: '#060c38' }}>
            {member.bio.split('\n\n').map((paragraph, i) => (
                <p key={i} className={`text-[9px] text-[#d0d4ff] leading-relaxed ${i > 0 ? 'mt-2' : ''}`}>
                    {paragraph}
                </p>
            ))}
        </div>

        {/* Footer: credit + stats */}
        <div className="flex justify-between items-center px-2 pb-2">
            <span className="text-[7px] text-[#5a5aaa]">Proxy by Cañón Cosmo Store</span>
            <div style={{ border: '1px solid #5a5aaa', background: '#0e1660' }} className="px-2 py-0.5">
                <span className="text-white font-bold text-xs">{member.stats}</span>
            </div>
        </div>
    </div>
);

const AboutUs = () => {
    const { t } = useTranslation();

    return (
        <section className="max-w-5xl mx-auto px-6 py-10 pb-20">
            <SEO
                title="Sobre Nosotros"
                description="Conoce Cañón Cosmo Store, tu tienda especializada en trading cards, Funko Pop y coleccionables."
                path="/aboutus"
            />

            <div className="mb-10">
                <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">
                    {t('aboutUs.subtitle', 'Party Members')}
                </p>
                <h2 className="font-headline font-bold text-2xl md:text-3xl uppercase tracking-widest text-on-surface">
                    {t('aboutUs.title')}
                </h2>
                <div className="h-px bg-primary/30 mt-4" />
                <p className="text-on-surface-variant text-sm leading-relaxed font-body mt-4 max-w-2xl">
                    {t('aboutUs.description')}
                </p>
            </div>

            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                {TEAM.map((member) => (
                    <TeamCard key={member.name} member={member} />
                ))}
            </div>
        </section>
    );
};

export default AboutUs;
