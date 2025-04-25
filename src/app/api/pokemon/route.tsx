import { NextResponse } from "next/server";

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface DamageRelations {
  double_damage_from: { name: string }[];
  double_damage_to: { name: string }[];
}

interface PokemonAPIResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
  species: {
    url: string;
  };
}

interface SpeciesData {
  evolution_chain: {
    url: string;
  };
}

interface EvolutionChain {
  chain: {
    species: {
      name: string;
    };
    evolves_to: EvolutionChain["chain"][];
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    const pokemon: PokemonAPIResponse = await response.json();

    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData: SpeciesData = await speciesResponse.json();

    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData: EvolutionChain = await evolutionResponse.json();

    const evolutions: string[] = [];
    let current = evolutionData.chain;

    do {
      evolutions.push(current.species.name);
      current = current.evolves_to[0] || null;
    } while (current);

    const weaknessesSet = new Set<string>();
    const strengthsSet = new Set<string>();

    for (const t of pokemon.types) {
      const res = await fetch(t.type.url);
      const typeData: { damage_relations: DamageRelations } = await res.json();

      typeData.damage_relations.double_damage_from.forEach((d) =>
        weaknessesSet.add(d.name)
      );
      typeData.damage_relations.double_damage_to.forEach((d) =>
        strengthsSet.add(d.name)
      );
    }

    return NextResponse.json({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.front_default,
      types: pokemon.types.map((t) => t.type.name),
      weaknesses: Array.from(weaknessesSet),
      strengths: Array.from(strengthsSet),
      evolutions,
    });
  } catch {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
