import { useState } from 'react'
import { usePages } from './usePages'
import Header from './components/Header'
import ActiveTab from './components/ActiveTab'
import LogTab from './components/LogTab'
import AddSheet from './components/AddSheet'
import FAB from './components/FAB'

export default function App() {
  const [pages, dispatch] = usePages()
  const [activeTab, setActiveTab] = useState('active')
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-bg flex flex-col max-w-[480px] mx-auto relative">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'active' ? (
        <ActiveTab pages={pages} dispatch={dispatch} />
      ) : (
        <LogTab pages={pages} dispatch={dispatch} />
      )}

      {!sheetOpen && <FAB onClick={() => setSheetOpen(true)} />}

      <AddSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        dispatch={dispatch}
      />
    </div>
  )
}
