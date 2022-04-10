import React from 'react'
import { TeamComposition } from '../../lib/interfaces/types'
import Button from '../atoms/Button'
import Radio from '../atoms/Radio'
import RoleIcon from '../atoms/RoleIcon'

interface PreparationScreenProps {
  team: TeamComposition
  currentUserRoleIndex?: number
  setCurrentUserRoleIndex: React.Dispatch<
    React.SetStateAction<number | undefined>
  >
  next?: () => void
}

const PreparationScreen = ({
  team,
  currentUserRoleIndex,
  setCurrentUserRoleIndex,
  next,
}: PreparationScreenProps) => {
  return (
    <>
      <div className='state_header'>
        <h1>Preparation</h1>
        <p>Choose your role</p>

        <table className='table' style={{ marginBottom: 20 }}>
          <tbody>
            {team.map((player, i) => (
              <tr key={i}>
                <td>
                  <Radio
                    checked={currentUserRoleIndex === i}
                    toggle={() => {
                      if (currentUserRoleIndex === i) return

                      setCurrentUserRoleIndex(i)
                    }}
                  />
                </td>
                <td>
                  <RoleIcon player={player[0]} />
                </td>
                <td>{player[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button
          variant='primary'
          disabled={currentUserRoleIndex == null}
          onClick={next}
        >
          Start
        </Button>
      </div>
    </>
  )
}

export default PreparationScreen
