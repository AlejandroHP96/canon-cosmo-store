import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import PokemonTCG from './pages/tcgs/PokemonTCG';
import RiftboundTCG from './pages/tcgs/RiftboundTCG';
import FinalFantasyTCG from './pages/tcgs/FinalFantasyTCG';
import DigimonTCG from './pages/tcgs/DigimonTCG';
import NarutoTCG from './pages/tcgs/NarutoTCG';
import OnePieceTCG from './pages/tcgs/OnePieceTCG';

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/tcgs/pokemon" element={<PokemonTCG />} />
                <Route path="/tcgs/riftbound" element={<RiftboundTCG />} />
                <Route path="/tcgs/final-fantasy" element={<FinalFantasyTCG />} />
                <Route path="/tcgs/digimon" element={<DigimonTCG />} />
                <Route path="/tcgs/naruto" element={<NarutoTCG />} />
                <Route path="/tcgs/one-piece" element={<OnePieceTCG />} />
            </Route>
        </Routes>
    );
};

export default App;
