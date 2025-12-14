import react from "@heroicons/react";


export const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <div className={`rounded-lg shadow-xl p-4 bg-linear-to-br from-${colorClass}/20 to-gray-900/50 border border-gray-800`}>
        <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <Icon className={`w-5 h-5 text-${colorClass}`} />
        </div>
        <div className="pt-2">
            <div className="text-3xl font-bold text-white">{value}</div>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
    </div>
);