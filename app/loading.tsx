export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='relative'>
      <div className='fixed top-0 left-0 w-full h-full bg-black opacity-70 z-50 flex justify-center items-center'>
        <div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20'></div>
      </div>
    </div>
  );
}
