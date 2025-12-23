// src/components/StatCard.jsx
export default function StatCard({ title, value, percent, isUp }) {
  return (
    <div className="p-4 bg-gay border border-gray-200 rounded-lg shadow-sm bg-gray-800 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <span className="text-2xl font-bold text-white-900 dark:text-white">
        {value}
      </span>
      
    </div>
  );
}
