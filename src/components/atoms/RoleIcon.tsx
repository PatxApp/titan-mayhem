import React from 'react'
import { SubRole } from '../../lib/interfaces/types'

interface RoleIconProps {
  player: SubRole
}

const RoleIcon = ({ player }: RoleIconProps) => {
  return (
    <div className='role__icon'>
      <img
        src={`${process.env.PUBLIC_URL}/role_${player.role}.png`}
        className='role__icon__img'
        alt='Role icon'
      />
      <div className='role__icon__position'>{player.pos}</div>
    </div>
  )
}

export default RoleIcon
