export const CustomCard =({ title, children }) => {
    return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-xl">
        <div className="p-4 border-b border-gray-800">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
    </div>
    )
} 