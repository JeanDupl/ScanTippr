export default function PayPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg px-6 py-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid Link</h1>
        <p className="text-gray-500 text-sm mb-6">
          It looks like you followed an invalid link. Please scan the QR code again to tip your employee.
        </p>
        
          href="https://www.scantippr.co.za"
          className="inline-block bg-blue-500 text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-blue-600 transition-all duration-150"
        >
          Go to ScanTippr
        </a>
      </div>
    </main>
  );
}
