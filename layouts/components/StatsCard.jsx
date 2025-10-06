"use client";

const StatsCard = ({ title, value, icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      light: "from-blue-50 to-blue-100",
      text: "text-blue-600",
      shadow: "shadow-blue-500/20",
    },
    green: {
      gradient: "from-green-500 to-emerald-600",
      light: "from-green-50 to-emerald-100",
      text: "text-green-600",
      shadow: "shadow-green-500/20",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      light: "from-purple-50 to-purple-100",
      text: "text-purple-600",
      shadow: "shadow-purple-500/20",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      light: "from-orange-50 to-orange-100",
      text: "text-orange-600",
      shadow: "shadow-orange-500/20",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md hover:scale-105 hover:-translate-y-1`}>
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.light} rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity`}></div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-gray-900 mb-3">{value}</h3>
          {trend && (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                trend === "up" ? "bg-green-100" : "bg-red-100"
              }`}>
                {trend === "up" ? (
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span className={`text-sm font-bold ${
                  trend === "up" ? "text-green-700" : "text-red-700"
                }`}>
                  {trendValue}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">vs last month</span>
            </div>
          )}
        </div>
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-sm border border-gray-200 transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  );
};

export default StatsCard;
