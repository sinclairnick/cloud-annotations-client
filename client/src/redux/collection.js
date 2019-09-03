import Collection from 'Collection'
import { endpointForLocationConstraint } from 'endpoints'
import { incrementSaving, decrementSaving } from 'redux/editor'
import socket from 'globalSocket'

// Actions
const SET = 'cloud-annotations/collection/SET'
const SET_TYPE = 'cloud-annotations/collection/SET_TYPE'
const CREATE_LABEL = 'cloud-annotations/collection/CREATE_LABEL'
const DELETE_LABEL = 'cloud-annotations/collection/DELETE_LABEL'
const UPLOAD_IMAGES = 'cloud-annotations/collection/UPLOAD_IMAGES'
const DELETE_IMAGES = 'cloud-annotations/collection/DELETE_IMAGES'
const CREATE_BOX = 'cloud-annotations/collection/CREATE_BOX'
const DELETE_BOX = 'cloud-annotations/collection/DELETE_BOX'

// Reducer
export default function reducer(collection = Collection.EMPTY, action = {}) {
  switch (action.type) {
    case SET:
      return action.collection
    case SET_TYPE:
      return collection.setType(...action.params)

    case CREATE_LABEL:
      {
        const [label, onComplete] = action.params
        if (onComplete) {
          socket.emit('patch', {
            op: '+',
            value: {
              labels: { label: label }
            }
          })
        }
      }
      return collection.createLabel(...action.params)

    case DELETE_LABEL:
      {
        const [label, onComplete] = action.params
        if (onComplete) {
          socket.emit('patch', {
            op: '-',
            value: {
              labels: { label: label }
            }
          })
        }
      }
      return collection.deleteLabel(...action.params)

    case UPLOAD_IMAGES:
      {
        const [images, onComplete] = action.params
        if (onComplete) {
          socket.emit('patch', {
            op: '+',
            value: {
              images: { images: images }
            }
          })
        }
      }
      return collection.uploadImages(...action.params)

    case DELETE_IMAGES:
      {
        const [images, onComplete] = action.params
        if (onComplete) {
          socket.emit('patch', {
            op: '-',
            value: {
              images: { images: images }
            }
          })
        }
      }
      return collection.deleteImages(...action.params)

    case CREATE_BOX:
      {
        const [image, box, onComplete] = action.params
        if (onComplete) {
          socket.emit('patch', {
            op: '+',
            value: {
              annotations: { image: image, box: box }
            }
          })
        }
      }
      return collection.createBox(...action.params)

    case DELETE_BOX:
      {
        const [image, box, onComplete] = action.params
        if (onComplete) {
          socket.emit('patch', {
            op: '-',
            value: {
              annotations: { image: image, box: box }
            }
          })
        }
      }
      return collection.deleteBox(...action.params)

    default:
      return collection
  }
}

// Action Creators
export const setCollection = c => ({ type: SET, collection: c })
export const clearCollection = () => setCollection(Collection.EMPTY)

export const setCollectionType = (type, onComplete) => ({
  type: SET_TYPE,
  params: [type, onComplete]
})

export const createLabel = (label, onComplete) => ({
  type: CREATE_LABEL,
  params: [label, onComplete]
})

export const deleteLabel = (label, onComplete) => ({
  type: DELETE_LABEL,
  params: [label, onComplete]
})

export const uploadImages = (images, onComplete) => ({
  type: UPLOAD_IMAGES,
  params: [images, onComplete]
})

export const deleteImages = (images, onComplete) => ({
  type: DELETE_IMAGES,
  params: [images, onComplete]
})

export const createBox = (image, box, onComplete) => ({
  type: CREATE_BOX,
  params: [image, box, onComplete]
})

export const deleteBox = (image, box, onComplete) => ({
  type: DELETE_BOX,
  params: [image, box, onComplete]
})

// Side Effects
export const loadCollection = async (bucket, location) => {
  const endpoint = endpointForLocationConstraint(location)
  return await Collection.load(endpoint, bucket)
}

// Thunk
export const syncAction = (action, args) => {
  return dispatch => {
    const onComplete = () => {
      dispatch(decrementSaving())
    }
    dispatch(action(...args, onComplete))
    dispatch(incrementSaving())
  }
}
