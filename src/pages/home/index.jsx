import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import RightArrow from "./right-arrow";

function Home() {
  const games = [
    {
      title: "井字棋",
      description: "经典的双人对战游戏",
      path: "/tic-tac-toe",
      color: "bg-purple-500",
    },
    {
      title: "计算器",
      description: "简单实用的计算工具",
      path: "/calculator",
      color: "bg-teal-500",
    },
    {
      title: "猜词游戏",
      description: "考验词汇量的益智游戏",
      path: "/wordle",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">欢迎来到小游戏世界</h1>
          <p className="text-gray-600 text-lg">选择一个游戏开始您的娱乐时光</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <GameCard key={game.path} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GameCard({ title, description, path, color }) {
  return (
    <Link to={path}>
      <div className="group relative overflow-hidden rounded bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
        <div className={`absolute top-0 left-0 h-1 w-full ${color}`} />

        <div className="flex items-start space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
          开始游戏
          <RightArrow />
        </div>
      </div>
    </Link>
  );
}

GameCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Home;
