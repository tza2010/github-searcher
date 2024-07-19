function LoadingSpinner() {
  return (
    <div className="my-5 flex items-center justify-center">
      <div
        className="w-12 h-12 rounded-full animate-spin
                    border-2 border-solid border-blue-500 border-t-transparent"
      ></div>
    </div>
  );
}

export default LoadingSpinner;
