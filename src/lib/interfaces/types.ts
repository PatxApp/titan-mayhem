export type Role = 'tank' | 'healer' | 'range' | 'melee' | 'mage'

type DPSpositions = 'd1' | 'd2' | 'd3' | 'd4'

type TankSubRole = {
  role: 'tank',
  pos: 'mt' | 'st'
}

type HealerSubRole = {
  role: 'healer',
  pos: 'h1' | 'h2'
}

type DPSSubRole = {
  role: 'range' | 'melee' | 'mage' ,
  pos: DPSpositions
}

export type SubRole = TankSubRole | HealerSubRole | DPSSubRole
 
export type TeamComposition = [SubRole, string][]