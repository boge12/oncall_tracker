export default function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 z-40 w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-light shadow-lg active:scale-95 transition-transform"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      aria-label="Add page"
    >
      +
    </button>
  )
}
