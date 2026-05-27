const Footer = () => {
    return (
        <footer className="fixed bottom-0 w-full z-50 flex flex-wrap justify-between items-center px-4 md:px-8 py-2 gap-y-1 bg-[#010241] border-t-2 border-[#e0e0ff] font-body text-[10px] tracking-tight">
            <div className="text-[#e0e0ff] hidden md:block">
                © 2023-2026 SHINRA ELECTRIC POWER CO.
            </div>
            <div className="flex gap-4 md:gap-6 uppercase">
                <a
                    key="cañon-cosmo-maps"
                    className="text-[#e0e0ff] opacity-50 hover:opacity-100 transition-opacity"
                    href="https://www.google.com/maps/place/Cañon+Cosmo+Store/@28.4667857,-16.2637576,17z/data=!3m1!4b1!4m6!3m5!1s0xc41cda849fbfb55:0x483355ad2bff9a0f!8m2!3d28.466781!4d-16.2611773!16s%2Fg%2F11lcj6fnj4?entry=ttu&g_ep=EgoyMDI2MDUyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer">
                    Donde estamos
                </a>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary animate-ping" />
                <span className="text-primary font-headline">
                    CONNECTION: SECURE
                </span>
            </div>
        </footer>
    );
};

export default Footer;
