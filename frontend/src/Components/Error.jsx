const Error = () => {
  return (
    <div className="container mx-auto mt-20 text-center">
      <h2 className="mb-4 text-6xl font-bold text-red-500">404</h2>
      <p className="mb-8 text-2xl text-gray-700">Oops! Page Not Found</p>
      <a
        href="/"
        className="px-6 py-2 text-white transition duration-300 bg-red-500 rounded-lg hover:bg-red-600"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default Error;
