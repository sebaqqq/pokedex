import { NextResponse } from "next/server";

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
    const pokemon = await response.json();

    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();

    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();

    const evolutions = [];
    let current = evolutionData.chain;

    do {
      evolutions.push(current.species.name);
      current = current.evolves_to[0] || null;
    } while (current);

    return NextResponse.json({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.front_default,
      types: pokemon.types.map((t: any) => t.type.name),
      weaknesses: Array.from(
        new Set(
          (
            await Promise.all(
              pokemon.types.map(async (t: any) => {
                const res = await fetch(t.type.url);
                return (
                  await res.json()
                ).damage_relations.double_damage_from.map((d: any) => d.name);
              })
            )
          ).flat()
        )
      ),
      strengths: Array.from(
        new Set(
          (
            await Promise.all(
              pokemon.types.map(async (t: any) => {
                const res = await fetch(t.type.url);
                return (await res.json()).damage_relations.double_damage_to.map(
                  (d: any) => d.name
                );
              })
            )
          ).flat()
        )
      ),
      evolutions,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
