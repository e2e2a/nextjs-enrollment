import Image from "next/image";

const LoaderPage = () => (
  <div className=" h-screen justify-center items-center bg-white z-50 select-none">
  <div className="flex flex-col justify-center top-16 items-center w-full h-full animate-out ease-out transition-transform duration-200">
    <Image
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
  
  export default LoaderPage;