import { Route, Routes } from 'react-router-dom';
import './App.css';
import CanonCosmoHome from './components/home/CanonCosmoHome';
import AboutUs from './components/aboutUs/AboutUs';

const App = () => {
	return (
		<div>
			<Routes>
				<Route path="/" element={<CanonCosmoHome />}></Route>
				<Route path="/aboutus" element={<AboutUs />}></Route>
			</Routes>
		</div>
	)
};

export default App;
