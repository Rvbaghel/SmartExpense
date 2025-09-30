const Loader = () => {

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.75s]"></span>
        <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.5s]"></span>
        <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.25s]"></span>
      </div>
    </div>
  );
};

export default Loader;
