const FOOTER_LINKS = ['System Info', 'Save', 'Help'];

const Footer = () => {
    return (
        <footer className="fixed bottom-0 w-full z-50 flex justify-between items-center px-8 py-2 bg-[#010241] border-t-2 border-[#e0e0ff] font-body text-[10px] tracking-tight">
            <div className="text-[#e0e0ff]">© 1997-2024 SHINRA ELECTRIC POWER CO.</div>
            <div className="flex gap-6 uppercase">
                {FOOTER_LINKS.map((link) => (
                    <a
                        key={link}
                        className="text-[#e0e0ff] opacity-50 hover:opacity-100 transition-opacity"
                        href="#">
                        {link}
                    </a>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary animate-ping"></span>
                <span className="text-primary font-headline">CONNECTION: SECURE</span>
            </div>
        </footer>
    );
};

export default Footer;
