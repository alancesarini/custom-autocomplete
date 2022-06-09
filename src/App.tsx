import Autocomplete from './components/Autocomplete/Autocomplete';
import './App.css';

function App() {
	return (
		<div className='App'>
			<div className='wrapper'>
				<Autocomplete minChars={3} delay={500} />
			</div>
		</div>
	);
}

export default App;
