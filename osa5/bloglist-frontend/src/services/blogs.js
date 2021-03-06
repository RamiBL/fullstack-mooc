import axios from "axios"
const baseUrl = "/api/blogs"

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)

  return request.then(response => {
    return response.data
  })
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)

  return response.data
}

const del = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

const put = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(
    `${baseUrl}/${newObject.id}`,
    newObject,
    config
  )
  return response.data
}

const update = newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.put(`${baseUrl}/${newObject.id}`, newObject, config)
  return request.then(response => response.data)
}

export default { getAll, setToken, create, put, update, del }
