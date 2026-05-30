import HeroSection from '../components/home/HeroSection';
import TcgGrid from '../components/home/TcgGrid';
import TournamentBanner from '../components/home/TournamentBanner';
import SEO from '../components/SEO';

const Home = () => (
    <div className="max-w-5xl mx-auto">
        <SEO
            description="Tienda especializada en Trading Card Games, Funko Pop, figuras y coleccionables. Pokémon, One Piece, Final Fantasy, Digimon y mucho más."
            path="/"
        />
        <HeroSection />
        <TcgGrid />
        <TournamentBanner />
    </div>
);

export default Home;
