import HeroSection from '../components/home/HeroSection';
import TcgGrid from '../components/home/TcgGrid';
import TournamentBanner from '../components/home/TournamentBanner';

const Home = () => (
    <div className="max-w-5xl mx-auto">
        <HeroSection />
        <TcgGrid />
        <TournamentBanner />
    </div>
);

export default Home;
