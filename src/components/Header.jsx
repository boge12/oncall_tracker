export default function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'pages', label: 'PAGES' },
    { id: 'consults', label: 'CONSULTS' },
    { id: 'log', label: 'LOG' }
  ]

  return (
    <header className="bg-surface pt-safe border-b border-border">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 min-h-[52px] text-sm font-semibold tracking-wide transition-colors
              ${activeTab === tab.id
                ? 'text-text border-b-2 border-accent'
                : 'text-text-muted'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  )
}
