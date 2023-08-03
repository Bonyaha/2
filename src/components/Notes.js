import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Notes = ({ notes, showAll, setShowAll }) => {
	console.log(notes)
	return (
		<div>
			<h2>Notes</h2>
			<button onClick={() => setShowAll(!showAll)} className="mb-2">
				show {showAll ? 'important' : 'all'}
			</button>

			<Table striped>
				<tbody>

					{notes.map(note =>
						<tr key={note.id}>
							<td>
								<Link to={`/notes/${note.id}`}>
									{note.content}
								</Link>
							</td>
							<td>
								{note.user.name}
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</div>
	)
}

export default Notes





