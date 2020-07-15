// a group of functions that need to be implemented for each backend
//  goal is to provide "shortcuts" during e2e tests

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { Blip } from '@/types/domain'
import { getUUID, cleanChange, cleanBlip } from '@/util'
import { store } from '../../store'

async function login (user: string = 'rick'): Promise<string> {
  let credentials
  switch (user) {
    case 'rick':
      credentials = 'rick@devradar.io:sanchez'
      break
    case 'morty':
      credentials = 'morty@devradar.io:jessica'
      break
  }
  return firebase.auth().signInWithEmailAndPassword(credentials.split(':')[0], credentials.split(':')[1])
    .then(login => login.user.uid)
}

async function addBlipToFirestore (radarId: string, blip: Blip): Promise<void> {
  const nBlip = cleanBlip(blip)
  const { changes } = blip
  // assign IDs to changes
  nBlip.changes = changes
    .map(c => {
      if (!c.id) c.id = getUUID()
      return c
    })
    .map(cleanChange)
  await firebase.firestore().collection(`radars/${radarId}/blips`).add(nBlip)
  return null
}

async function addBlip (blip: Blip): Promise<void> {
  return store.dispatch('blips/addBlip', blip)
}

async function dropBlips (): Promise<void> {
  return store.dispatch('blips/setBlips', [])
}

async function getRadarIdByUserId (userId: string): Promise<string> {
  let retryCount = 9
  while (retryCount) {
    const getSnapshot = await firebase.firestore().collection('radars')
      .where('owner', '==', userId)
      .limit(3)
      .get()
    if (getSnapshot.size > 0) {
      return getSnapshot.docs[0].id
    }
    await new Promise((resolve) => setTimeout(() => resolve(), 200))
    retryCount--
  }
  throw new Error(`Reached max retries while trying to getRadarIdByUserId(${userId})`)
}
export default {
  login,
  addBlip,
  addBlipToFirestore,
  dropBlips,
  getRadarIdByUserId
}
