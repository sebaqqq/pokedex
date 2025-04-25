"use client";

import { useState } from "react";
import PokedexBackground from "./components/PokedexBackground";
import Image from "next/image";

interface PokemonData {
  id: number;
  name: string;
  image: string;
  types: string[];
  weaknesses: string[];
  strengths: string[];
  evolutions: string[];
}

export default function Pokedex() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<PokemonData | null>(null);
  const [error, setError] = useState("");

  const searchPokemon = async () => {
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/pokemon?query=${query}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Error fetching data");
    }
  };

  return (
    <PokedexBackground>
      <div className="absolute top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-60">
        <h1 className="text-4xl font-bold text-center mb-6 text-cyan-500">
          Pokédex
        </h1>
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Buscar por nombre, ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-xl mb-4"
          />
          <button
            onClick={searchPokemon}
            className="w-full bg-indigo-900 text-white py-2 rounded-xl hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            Buscar
          </button>

          {error && <p className="text-orange-300 mt-4">{error}</p>}

          {result && (
            <div className="mt-6 bg-indigo-900 p-4 rounded-3xl shadow">
              <Image
                src={result.image}
                alt={result.name}
                width={192}
                height={192}
                className="mx-auto mb-4"
              />
              <h2 className="text-xl mb-4 font-bold text-center text-white uppercase">
                {result.name} (ID: {result.id})
              </h2>
              <p className="text-center mb-4 font-semibold text-white">
                <strong>Tipos:</strong> {result.types.join(", ").toUpperCase()}
              </p>
              <p className="text-center mb-4 font-mono text-white">
                <strong className="font-semibold">Debilidades:</strong>{" "}
                {result.weaknesses.join(", ").toUpperCase()}
              </p>
              <p className="text-center mb-4 font-mono text-white">
                <strong className="font-semibold">Fortalezas:</strong>{" "}
                {result.strengths.join(", ").toUpperCase()}
              </p>
              <p className="text-center font-mono text-white bg-blue-700 p-1 rounded-lg">
                <strong className="font-semibold">Evoluciones:</strong>{" "}
                {result.evolutions.join(" → ").toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </PokedexBackground>
  );
}
