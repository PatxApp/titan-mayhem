import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useEffectOnUnmount } from '../../lib/hooks'
import { SubRole, TeamComposition } from '../../lib/interfaces/types'
import Button from '../atoms/Button'
import Radio from '../atoms/Radio'
import RoleIcon from '../atoms/RoleIcon'

interface ExecutionScreenProps {
  counters: {
    ok: number
    err: number
  }
  priorities: TeamComposition
  currentPlayerIndex: number
  setCounters: React.Dispatch<
    React.SetStateAction<{
      ok: number
      err: number
    }>
  >
  setState: React.Dispatch<React.SetStateAction<'idle' | 'execute'>>
}

//reference: https://www.youtube.com/watch?v=w3Gl6KR_fYQ
//knockback start: T-7
//knockback end: T-10
//Geol indication: T-11
//Geol resolution: T-15

const resolutionInSec = 7
const upheavalResolvedInSec = 3

const ExecutionScreen = ({
  counters,
  setCounters,
  priorities,
  currentPlayerIndex,
  setState,
}: ExecutionScreenProps) => {
  const [chosenPlace, setChosenPlace] = useState<number>()
  const [drawn, setDrawn] = useState<SubRole[]>([])
  const [isResolved, setIsResolved] = useState(false)
  const [timer, setTimer] = React.useState(0) //ms
  const timerRef = useRef<any>()

  const clearInterval = () => {
    window.clearInterval(timerRef.current)
  }

  const setupInterval = useCallback(() => {
    setTimer(0)
    timerRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 10)
    }, 10)
  }, [])

  const increaseCounter = useCallback(() => {
    const position = priorities[currentPlayerIndex]
    const drawnedPositions = drawn.map((d) => d.pos)
    const drawnedPriorities = priorities.filter((p) =>
      drawnedPositions.includes(p[0].pos)
    )
    if (
      (position[0].pos === 'mt' && chosenPlace === 0) ||
      (chosenPlace === 0 && !drawnedPositions.includes(position[0].pos)) ||
      ((chosenPlace || 0) > 0 &&
        drawnedPriorities.findIndex((d) => d[0].pos === position[0].pos) + 1 ===
          chosenPlace)
    ) {
      setCounters((val) => {
        const newVal = Object.assign({}, val)
        newVal.ok = newVal.ok + 1
        return newVal
      })
    } else {
      setCounters((val) => {
        const newVal = Object.assign({}, val)
        newVal.err = newVal.err + 1
        return newVal
      })
    }
  }, [chosenPlace, currentPlayerIndex, drawn, priorities, setCounters])

  useEffectOnce(() => {
    pickThree()
    setupInterval()
  })

  useEffectOnUnmount(() => clearInterval())

  useEffect(() => {
    if (timer === resolutionInSec * 1000) {
      setIsResolved(true)
      clearInterval()
      increaseCounter()
    }
  }, [timer, increaseCounter])

  const pickThree = useCallback(() => {
    setDrawn(
      priorities
        .filter((player) => player[0].pos !== 'mt')
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((player) => player[0])
    )
  }, [priorities])

  const startAgain = useCallback(() => {
    setIsResolved(false)
    setChosenPlace(undefined)
    pickThree()
    setupInterval()
  }, [setupInterval, pickThree])

  const resolutionResult = useMemo(() => {
    if (!isResolved) {
      return null
    }

    const position = priorities[currentPlayerIndex]
    const drawnedPositions = drawn.map((d) => d.pos)
    const drawnedPriorities = priorities.filter((p) =>
      drawnedPositions.includes(p[0].pos)
    )
    if (
      (position[0].pos === 'mt' && chosenPlace === 0) ||
      (chosenPlace === 0 && !drawnedPositions.includes(position[0].pos)) ||
      ((chosenPlace || 0) > 0 &&
        drawnedPriorities.findIndex((d) => d[0].pos === position[0].pos) + 1 ===
          chosenPlace)
    ) {
      return {
        type: 'success',
        drawnedPriorities,
      }
    }

    return {
      type: 'fail',
      drawnedPriorities,
    }
  }, [isResolved, priorities, currentPlayerIndex, chosenPlace, drawn])

  return (
    <>
      <div className='arena'>
        {[0, 1, 2, 3].map((index) => (
          <Radio
            key={`chosen-place-${index}`}
            className={`choice choice-${index}`}
            checked={chosenPlace === index}
            disabled={
              timer / 1000 < upheavalResolvedInSec ||
              timer / 1000 >= resolutionInSec
            }
            toggle={() => {
              if (index === chosenPlace || timer / 1000 >= resolutionInSec) {
                return
              }
              setChosenPlace(index)
            }}
          />
        ))}
        <img
          src={`${process.env.PUBLIC_URL}/arena.png`}
          className='arena_img'
          alt='Role icon'
        />
        {timer / 1000 < upheavalResolvedInSec && (
          <div className='casting'>
            <div className='casting__wrapper'>
              <div className='casting__text'>Upheaval</div>
              <div className='casting__bar'>
                <div
                  className='casting__progress'
                  style={{
                    maxWidth: '100%',
                    width: `${(timer / 1000 / upheavalResolvedInSec) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {resolutionResult != null && (
        <div className='resolved__summary'>
          <h3>Resolved</h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ marginRight: 10 }}>As</span>{' '}
            <RoleIcon player={priorities[currentPlayerIndex][0]} />
            <p className={`resolved__text ${resolutionResult.type}`}>
              {resolutionResult.type}
            </p>
          </div>
          <p>
            <span className='success'>{counters.ok}</span> |{' '}
            <span className='fail'>{counters.err}</span>
          </p>
          <div
            style={{
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {resolutionResult.drawnedPriorities.map((player) => (
              <RoleIcon player={player[0]} key={`resolved-${player[0].pos}`} />
            ))}
          </div>
          <small>Everyone else on the left</small>
          <Button variant='primary' onClick={startAgain}>
            Restart
          </Button>
          <Button variant='secondary' onClick={() => setState('idle')}>
            Change role
          </Button>
        </div>
      )}

      <div className='chosen_players'>
        {(isResolved || timer / 1000 >= upheavalResolvedInSec + 1) && (
          <>
            {drawn.map((player) => (
              <RoleIcon player={player} key={player.pos} />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default ExecutionScreen
