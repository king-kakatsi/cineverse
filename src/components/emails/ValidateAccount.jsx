export default function ValidateAccount({ token }) {
  const url = `http://localhost:3000/api/verify-account?token=${token}`;
  return (
    <div className="bg-gray-50 p-6 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to CinéVerse
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for registration on <strong>CinéVerse</strong> ! Click on
          the button to verified your account
        </p>
        <a
          href={url}
          className="inline-block bg-[#FF4F5A] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#e0404b] transition"
        >
          Verified my account
        </a>
        <p className="text-gray-500 text-sm mt-6">
          If you are not responsible for this action, ignore this email.
        </p>
      </div>
    </div>
  );
}
