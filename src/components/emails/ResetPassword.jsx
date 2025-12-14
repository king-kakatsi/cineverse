export default function ResetPassword({ token }) {
  const url = `http://localhost:3000/account/forgot-password?token=${token}`;
  return (
    <div className="bg-gray-50 p-6 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Reset your password
        </h1>
        <p className="text-gray-600 mb-6">
          You have requested to reset your password on CinéVerse. Click the
          button below to continue.
        </p>
        <a
          href={url}
          className="inline-block bg-[#FF4F5A] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#e0404b] transition"
        >
          Reset your password
        </a>
        <p className="text-gray-500 text-sm mt-6">
          If you did not make this request, ignore this email.
        </p>
      </div>
    </div>
  );
}
