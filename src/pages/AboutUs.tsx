import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import TeamCard from '../components/aboutUs/TeamCard';
import TeamModal from '../components/aboutUs/TeamModal';
import { buildTeam, type TeamMember } from '../components/aboutUs/team';

const AboutUs = () => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<TeamMember | null>(null);
    const team = useMemo(() => buildTeam(t), [t]);

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
                {team.map((member) => (
                    <TeamCard
                        key={member.name}
                        member={member}
                        onClick={() => setSelected(member)}
                    />
                ))}
            </div>

            {selected && <TeamModal member={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};

export default AboutUs;
