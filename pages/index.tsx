import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'


interface Notes {
    notes: {
        id: string
        title: string
        content: string
        name: any
        email: any
    }[]
}

interface FormData {
    title: string
    content: string
    id: string
    email: any
    name: any

}

const Home = ({ notes }: Notes) => {
    const [form, setForm] = useState<FormData>({ title: '', content: '', id: '', name: '', email: '' })
    const router = useRouter()

    const refreshData = () => {
        router.replace(router.asPath)
    }



    async function deleteNote(id: string) {
        try {
            fetch(`http://localhost:3000/api/note/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'DELETE'
            }).then(() => {
                refreshData()
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (data: FormData) => {
        const method = data.id ? 'PUT' : 'POST';
        const url = data.id ? `http://localhost:3000/api/update` : `http://localhost:3000/api/create`;

        try {
            await fetch(url, {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: method
            });
            setForm({ title: '', content: '', id: '', name: '', email: '' });
            refreshData();
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <h1 className="text-center font-bold text-2xl mt-4">Employee</h1>
            <form onSubmit={e => {
                e.preventDefault()
                handleSubmit(form)
            }} className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
                <input type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="border-2 rounded border-gray-600 p-1"
                />
                <input type="text"
                    placeholder="Email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="border-2 rounded border-gray-600 p-1"
                />
                <input type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="border-2 rounded border-gray-600 p-1"
                />

                <textarea
                    placeholder="Content"
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="border-2 rounded border-gray-600 p-1"
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-1">Add +</button>
            </form>
            <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
                <ul>
                    {notes.map(note => (
                        <li key={note.id} className="border-b border-gray-600 p-2">
                            <div className="flex justify-between">
                                <div className="flex-1 m-4">
                                    <h3 className="font-bold">{note.title}</h3>
                                    <p className="text-sm">{note.name}</p>
                                    <p className="text-sm">{note.email}</p>

                                    <p className="text-sm">{note.content}</p>
                                </div>
                                <button onClick={() => setForm({ title: note.title, content: note.content, id: note.id, name: note.name, email: note.email })} className="bg-blue-500 mr-3 px-3 text-white rounded">Edit</button>
                                <button onClick={() => deleteNote(note.id)} className="bg-red-500 px-3 text-white rounded">X</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Home


export const getServerSideProps: GetServerSideProps = async () => {
    const notes = await prisma.note.findMany({
        select: {
            title: true,
            id: true,
            content: true,
            name: true,
            email: true
        }
    })

    return {
        props: {
            notes
        }
    }
}