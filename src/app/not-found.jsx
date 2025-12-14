import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-600/20">404</div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Fun Fact */}
        <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 italic">
            Not all those who wander are lost... but you seem to be.
            <br />
            <span className="text-gray-500 text-xs">- Gandalf (probably)</span>
          </p>
        </div>
      </div>
    </div>
  );
}