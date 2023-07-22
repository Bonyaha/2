import { Link } from 'react-router-dom'
const Notes = ({ notes }) => {
	return (
		<div>
			<h2>Notes</h2>
			<ul>
				{notes.map((note) => (
					/*{ <Note
						key={note.id}
						note={note}
						toggleImportance={() => toggleImportanceOf(note.id)}
						deleteNote={() => deleteNote(note.id)}
					/> }*/
					<li key={note.id} >
						<Link to={`/notes/${note.id}`}>{note.content}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Notes

