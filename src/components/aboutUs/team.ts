import toniImg from '../../assets/toni.png';
import jonayImg from '../../assets/jonay.png';

export type TeamMember = {
    name: string;
    role: string;
    types: string[];
    bio: string;
    initials: string;
    avatarBg: string;
    avatarImg?: string;
    legendaryCreature: string;
};

type Translate = (key: string) => string;

/** Las cartas del equipo. Los textos vienen de i18n; el resto es fijo. */
export function buildTeam(t: Translate): TeamMember[] {
    const comun = { legendaryCreature: t('aboutUs.legendaryCreature') };

    return [
        {
            ...comun,
            name: 'TONI',
            role: t('aboutUs.team.toni.role'),
            types: [t('aboutUs.team.toni.type1'), t('aboutUs.team.toni.type2')],
            bio: t('aboutUs.team.toni.bio'),
            initials: 'T',
            avatarBg: '#1a2870',
            avatarImg: toniImg,
        },
        {
            ...comun,
            name: 'JONAY',
            role: t('aboutUs.team.jonay.role'),
            types: [
                t('aboutUs.team.jonay.type1'),
                t('aboutUs.team.jonay.type2'),
            ],
            bio: t('aboutUs.team.jonay.bio'),
            initials: 'J',
            avatarBg: '#2a1870',
            avatarImg: jonayImg,
        },
    ];
}
