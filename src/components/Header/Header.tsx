const AVATAR_URL =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCPX72NmtgE34GklfQrIlfRtOgKf815sO-KPpVubbYM7tYkD5Ojr5gX1uhaXd0dE0w3q4kMPr0yonMrOQd-4HAs_EBeNPRSfBJ1Qss_nn54uWnZ1uNgR24-DTNvUkzZaOGqR8HShrbZ4AZ-lUcF_3YX3A7sy3e1JJoqtA_6ZXvv_kq53viz76dCil6VllFiO9lGvL5KkpR7pnTPBX04iGKU7KFwVE5vpi3eoAYkvDnaVEanggvbgNOG62U7tVm7Ay5A0TCR4wN51UQ';

const NAV_LINKS = ['Materia', 'Weapons', 'Armor', 'Accessories'];

const Header = () => {
    return (
        <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-linear-to-b from-[#000180] to-[#060946] border-b-2 border-[#e0e0ff] shadow-[inset_0_0_8px_rgba(0,1,172,1)]">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold text-[#e0e0ff] font-headline uppercase tracking-widest">
                    CAÑÓN COSMO
                </h1>
                <nav className="hidden md:flex gap-6 font-headline uppercase tracking-widest text-sm">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link}
                            className="text-[#e0e0ff] opacity-70 hover:text-[#bec2ff] hover:translate-x-1 transition-transform"
                            href="#">
                            {link}
                        </a>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-[#e0e0ff] overflow-hidden bg-surface-container">
                    <img
                        className="w-full h-full object-cover"
                        src={AVATAR_URL}
                        alt="Player avatar"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
