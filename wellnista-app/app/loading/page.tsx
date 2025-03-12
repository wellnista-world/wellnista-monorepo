
export default function LoadingScreen() {
    return (
    <div className="mt-10 flex items-center justify-center">
        {/*Body*/}
        <div className="w-52 h-52 flex items-center text-2xl text-secondary bg-primary justify-center rounded-full border-[#8A7F5F] border-t-transparent">
          <span className="text-[#FFFFFF] font-bold">Loading...</span>
        </div>
    </div>
    );
  }