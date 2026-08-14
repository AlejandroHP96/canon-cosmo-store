import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/** Ruta inexistente. Se marca noindex para que Google no la indexe como página real. */
const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center py-20 px-4">
            <Helmet>
                <title>{`${t('notFound.seoTitle')} | Cañón Cosmo Store`}</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="tactical-frame p-8 max-w-md w-full text-center">
                <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-2">
                    {t('notFound.label')}
                </p>
                <h1 className="font-headline font-bold text-4xl text-primary mb-3">
                    404
                </h1>
                <h2 className="font-headline font-bold text-base uppercase tracking-widest text-on-surface mb-2">
                    {t('notFound.title')}
                </h2>
                <p className="font-body text-sm text-on-surface-variant mb-8">
                    {t('notFound.text')}
                </p>
                <Link
                    to="/"
                    className="inline-block border border-primary text-primary font-headline text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-primary hover:text-surface transition-colors">
                    {t('notFound.home')}
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
