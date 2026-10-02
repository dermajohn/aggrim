interface GenrePillProps {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function GenrePill({ name, isActive = false, onClick }: GenrePillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? 'bg-[#e50914] text-white'
          : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
      }`}
    >
      {name}
    </button>
  );
}
