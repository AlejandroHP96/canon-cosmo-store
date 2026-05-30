import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const AboutUs = () => {
    const { t } = useTranslation();

    return (
        <section className="max-w-5xl mx-auto px-6 py-20">
            <SEO
                title="Sobre Nosotros"
                description="Conoce Cañón Cosmo Store, tu tienda especializada en trading cards, Funko Pop y coleccionables."
                path="/aboutus"
            />
            <h2 className="text-3xl font-bold font-headline text-on-surface mb-6 uppercase tracking-widest">
                {t('aboutUs.title')}
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed font-body">
                {t('aboutUs.description')}
            </p>
        </section>
    );
};

export default AboutUs;
