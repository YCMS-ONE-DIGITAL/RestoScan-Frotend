
export default function SalesChartCard({ value, percent, subtitle, children }) {
  return (
    <div className="p-4 bg-gray border border-gray-200 rounded-lg shadow-sm bg-gray-800  dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white-900 dark:text-white">{value}</h2>
          <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="text-green-500 dark:text-green-400 text-sm">
          ▲ {percent}%
        </div>
      </div>
      <div className="min-h-[350px]">
        {children ? children : <p className="text-gray-500">Chart Coming...</p>}
      </div>
    </div>
  );
}
