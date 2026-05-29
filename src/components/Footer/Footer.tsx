import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="fixed bottom-0 w-full z-50 flex flex-wrap justify-between items-center px-4 md:px-8 py-2 gap-y-1 bg-[#010241] border-t-2 border-[#e0e0ff] font-body text-[10px] tracking-tight">
            <div className="text-[#e0e0ff] hidden md:block">
                {t('footer.copyright')}
            </div>
            <div className="flex gap-4 md:gap-6 uppercase">
                <a
                    key="cañon-cosmo-maps"
                    className="text-[#e0e0ff] opacity-50 hover:opacity-100 transition-opacity"
                    href="https://www.google.com/maps/place/Cañon+Cosmo+Store/@28.4667857,-16.2637576,17z/data=!3m1!4b1!4m6!3m5!1s0xc41cda849fbfb55:0x483355ad2bff9a0f!8m2!3d28.466781!4d-16.2611773!16s%2Fg%2F11lcj6fnj4?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer">
                    {t('footer.whereWeAre')}
                </a>
            </div>
            <div className="flex items-center gap-4">
                <a
                    href="https://www.instagram.com/canon.cosmo.store"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    className="text-[#e0e0ff] opacity-50 hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping" />
                    <span className="text-primary font-headline">
                        {t('footer.connection')}
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
