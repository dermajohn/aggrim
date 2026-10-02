interface SeasonSelectorProps {
  seasons: Array<{
    season_number: number;
    name: string;
  }>;
  selectedSeason: number;
  onSeasonChange: (season: number) => void;
}

export default function SeasonSelector({ seasons, selectedSeason, onSeasonChange }: SeasonSelectorProps) {
  return (
    <select
      value={selectedSeason}
      onChange={(e) => onSeasonChange(Number(e.target.value))}
      className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-white focus:outline-none transition-colors"
    >
      {seasons.map((season) => (
        <option key={season.season_number} value={season.season_number}>
          {season.name}
        </option>
      ))}
    </select>
  );
}
