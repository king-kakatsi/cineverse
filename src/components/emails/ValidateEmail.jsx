export default function ValidateEmail({ token }) {
  const url = `https://cineverse.com/validate-email?token=${token}`;
  return (
    <div className="bg-gray-50 p-6 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Confirmez votre nouvelle adresse e-mail
        </h1>
        <p className="text-gray-600 mb-6">
          Vous avez demandé à changer votre adresse e-mail sur CinéVerse.
          Cliquez ci-dessous pour confirmer.
        </p>
        <a
          href={url}
          className="inline-block bg-[#FF4F5A] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#e0404b] transition"
        >
          Confirmer l’adresse
        </a>
        <p className="text-gray-500 text-sm mt-6">
          Si vous n’avez pas initié cette demande, ignorez simplement ce mail.
        </p>
      </div>
    </div>
  );
}
