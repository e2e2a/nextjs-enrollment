const Loader = () => (
  <div className="fixed inset-0 flex justify-center top-16 items-center bg-white z-50 select-none">
  <div className="flex flex-col items-center">
    <img
      src="/icons/loader.svg"
      alt="loader"
      width={48}
      height={48}
      className="animate-spin"
    />
    <p className="mt-4 text-gray-700">Loading...</p>
  </div>
</div>
  );
  
  export default Loader;