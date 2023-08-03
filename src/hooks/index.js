import { useState } from 'react'
import axios from 'axios'

const useResource = (token) => {
	const baseUrl = '/api/notes'
	const [resources, setResources] = useState([])

	const getAll = async () => {
		try {
			const response = await axios.get(baseUrl)
			setResources(response.data)
		} catch (error) {
			console.error('Error fetching resources:', error)
		}
	}

	const create = async (newObject) => {
		try {
			const response = await axios.post(baseUrl, newObject, {
				headers: { Authorization: `Bearer ${token}` },
			})
			setResources([...resources, response.data])
			return response.data
		} catch (error) {
			console.error('Error creating resource:', error)
			throw error
		}
	}

	const deleteNote = (id) => {
		const config = { headers: { Authorization: `Bearer ${token}` } }

		axios.delete(`${baseUrl}/${id}`, config)
		setResources(resources.filter((n) => n.id !== id))
	}




	const update = async (id, newNote) => {
		try {
			const response = await axios.put(`${baseUrl}/${id}`, newNote)
			if (!response.data) {
				setResources(resources.filter((n) => n.id !== id))
			} else {
				setResources(resources.map((note) => (note.id !== id ? note : response.data)))
			}
			return response.data
		} catch (error) {
			setResources(resources.filter((n) => n.id !== id))
			throw error
		}
	}

	return [resources, { getAll, create, update, deleteNote }]
}
export default useResource


