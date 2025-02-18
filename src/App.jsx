import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=20&limit=20');
        const results = response.data.results;

        const pokemonDetails = await Promise.all(
          results.map(async (pokemon) => {
            const detail = await axios.get(pokemon.url);
            return {
              id: detail.data.id,
              name: detail.data.name,
              image: detail.data.sprites.other['official-artwork'].front_default,
              types: detail.data.types.map(type => type.type.name)
            };
          })
        );

        setPokemons(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type) => {
    const colors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-600',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-400',
    };
    return colors[type] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <video autoPlay loop muted className="w-24 h-24">
          <source src="/pokebal.webm" type="video/webm" />
          Loading Pokédex...
        </video>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex justify-center items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Pokédex</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-0 px-4 py-2 rounded-lg  transition-colors duration-200"
          >
            <img
              src={darkMode ? '/sun.png' : '/moon.png'}
              alt={darkMode ? 'Light mode' : 'Dark mode'}
              className={`w-8 h-8 transform transition-all duration-500 ease-in-out ${darkMode ? 'filter invert brightness-100 rotate-90' : 'rotate-0'
                }`}
            />

          </button>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
            >
              <div className="p-4">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-full h-48 object-contain"
                />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white capitalize mt-4">
                  {pokemon.name}
                </h2>
                <div className="mt-2 flex gap-2">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className={`${getTypeColor(type)} px-3 py-1 rounded-full text-white text-sm capitalize`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;