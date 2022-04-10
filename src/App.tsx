import React, { useMemo, useState } from 'react'
import './App.css'
import ExecutionScreen from './components/organisms/ExecutionScreen'
import PreparationScreen from './components/organisms/PreparationScreen'
import { TeamComposition } from './lib/interfaces/types'
import { resolvePriorities } from './lib/utils/priorities'

function App() {
  const [state, setState] = useState<'idle' | 'execute'>('idle')
  const [team, setTeam] = useState<TeamComposition>(defaultComposition)
  const [currentUserRoleIndex, setCurrentUserRoleIndex] = useState<number>()
  const [counters, setCounters] = useState({ ok: 0, err: 0 })

  const priorities = useMemo(() => {
    return team.sort((a, b) => resolvePriorities(a[0], b[0]))
  }, [team])

  return (
    <div className='App'>
      <header className='App-header'>
        {state === 'idle' ? (
          <PreparationScreen
            team={team}
            currentUserRoleIndex={currentUserRoleIndex}
            setCurrentUserRoleIndex={setCurrentUserRoleIndex}
            next={() => setState('execute')}
          />
        ) : (
          <ExecutionScreen
            priorities={priorities}
            currentPlayerIndex={currentUserRoleIndex || 0}
            setState={setState}
            counters={counters}
            setCounters={setCounters}
          />
        )}
      </header>
    </div>
  )
}

export default App

const defaultComposition: TeamComposition = [
  [{ role: 'tank', pos: 'mt' }, 'Mina'],
  [{ role: 'tank', pos: 'st' }, 'Jin'],
  [{ role: 'healer', pos: 'h1' }, 'Anny'],
  [{ role: 'healer', pos: 'h2' }, 'Rin'],
  [{ role: 'melee', pos: 'd1' }, 'Ryuusei'],
  [{ role: 'melee', pos: 'd2' }, 'Peach'],
  [{ role: 'range', pos: 'd3' }, 'Snaps'],
  [{ role: 'mage', pos: 'd4' }, 'Udon'],
]
