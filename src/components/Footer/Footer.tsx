import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const getMakoLevel = (): number => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const normalized = minutes / (24 * 60);
    const level = Math.round(50 + 40 * Math.sin(2 * Math.PI * (normalized - 0.25)));
    return Math.max(10, Math.min(99, level));
};

const Footer = () => {
    const { t } = useTranslation();
    const [makoLevel, setMakoLevel] = useState(getMakoLevel);

    useEffect(() => {
        const id = setInterval(() => setMakoLevel(getMakoLevel()), 60_000);
        return () => clearInterval(id);
    }, []);

    return (
        <footer className="fixed bottom-0 w-full z-50 flex flex-wrap justify-between items-center px-4 md:px-8 py-2 gap-y-1 bg-[#010241] border-t-2 border-[#e0e0ff] font-body text-[10px] tracking-tight">
            <div className="hidden lg:flex items-center gap-3">
                <span className="material-symbols-outlined text-sm text-primary">terminal</span>
                <span className="text-primary tracking-[0.25em] font-headline uppercase text-[9px]">Shinra Inc. Terminal</span>
                <span className="w-1.5 h-1.5 bg-green-400 animate-ping shrink-0" />
                <span className="text-[#bec2ff]/30">|</span>
                <span className="material-symbols-outlined text-xs text-yellow-400">bolt</span>
                <span className="text-[#bec2ff]/70 font-headline uppercase tracking-widest text-[9px]">Mako</span>
                <div className="flex items-center gap-1">
                    <div className="w-16 h-1 bg-[#bec2ff]/10">
                        <div className="h-full bg-yellow-400/80 transition-all duration-2000 ease-in-out" style={{ width: `${makoLevel}%` }} />
                    </div>
                    <span className="text-yellow-400 font-headline text-[9px]">{makoLevel}%</span>
                </div>
                <span className="text-[#bec2ff]/30">|</span>
                <span className="material-symbols-outlined text-xs text-green-400">public</span>
                <span className="text-[#bec2ff]/70 font-headline uppercase tracking-widest text-[9px]">Planeta</span>
                <span className="text-green-400 font-headline tracking-widest text-[9px]">ESTABLE</span>
                <span className="text-[#bec2ff]/30">|</span>
                <span className="material-symbols-outlined text-xs text-red-400">warning</span>
                <span className="text-[#bec2ff]/70 font-headline uppercase tracking-widest text-[9px]">Avalancha</span>
                <span className="text-red-400 font-headline tracking-widest text-[9px]">DETECTADA</span>
            </div>
            <div className="flex items-center gap-4">
                <Link
                    to="/aboutus"
                    className="sm:hidden font-headline uppercase tracking-widest text-[9px] text-[#e0e0ff] opacity-50 hover:opacity-100 transition-opacity">
                    {t('header.aboutUs')}
                </Link>
                <span className="sm:hidden text-[#bec2ff]/30">|</span>
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
                <a
                    href="https://www.google.com/maps/place/Cañon+Cosmo+Store/@28.4667857,-16.2637576,17z/data=!3m1!4b1!4m6!3m5!1s0xc41cda849fbfb55:0x483355ad2bff9a0f!8m2!3d28.466781!4d-16.2611773!16s%2Fg%2F11lcj6fnj4?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Google Maps"
                    className="text-[#e0e0ff] opacity-50 hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
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
