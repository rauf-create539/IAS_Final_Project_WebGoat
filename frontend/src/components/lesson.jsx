import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../modals/LogoutModal';
import api from '../api';

const Lesson = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [query, setQuery] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '', explanation: '' });

    useEffect(() => {
        api.get('/user/')
            .then(res => setUsername(res.data.username))
            .catch(() => navigate('/'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const insecurePatterns = ["'", "--", ";", "OR 1=1"];
        const containsInsecure = insecurePatterns.some(pattern => query.toUpperCase().includes(pattern));

        if (containsInsecure) {
            setFeedback({
                message: "Potential SQL Injection detected!",
                type: "error",
                explanation: "By including characters like `'` or `--`, you are breaking the intended query structure. The single quote `'` closes the data string early, allowing you to append new SQL commands (like `OR 1=1`) that the developer didn't intend to run. Always look out for input that tries to 'escape' its boundaries."
            });
        } else if (query.toLowerCase().includes("select department from employees")) {
            setFeedback({
                message: "Correct! You wrote a valid SQL query.",
                type: "success",
                explanation: (
                    <>
                        <p>
                            This query correctly retrieves the 'department' field from the employees table using a proper SELECT statement. This is how queries are intended to work.
                        </p>
                        <p className='mt-4'>
                            <span className='font-bold'> Security Insight: </span> SQL Injection happens when user input is directly inserted into queries without protection. To prevent this, developers use parameterized queries (prepared statements), which ensure that user input is treated strictly as data—not 

                        </p>
                    </>
                )
            });

            setIsCompleted(true);
        } else {
            setFeedback({
                message: "Try again. Remember to SELECT the department column.",
                type: "info",
                explanation: "Your query structure is not correct, it doesn't target the requested data. Look out for the specific column names ('department') and table names ('employees') defined in the schema above."
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />

            <nav className="w-full bg-white shadow-sm px-8 py-4 flex justify-between items-center mb-8 border-b">
                <div className="font-black text-xl tracking-tight text-slate-800 uppercase">
                    <span className="text-red-600">WebGoat</span> Lesson
                </div>

                {username && (
                    <div className="text-slate-600 font-medium text-lg">
                        Welcome, <span className="text-slate-900 font-bold">{username}</span>
                    </div>
                )}

                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-slate-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-700 transition-all shadow-sm text-sm"
                >
                    Logout
                </button>
            </nav>

            {/* Main Content Area */}
            <div className="p-8 pt-0">
                <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
                </div>

                <main className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-10">
                    <h1 className="text-5xl font-light text-slate-800 mb-8 border-b pb-4">Understanding SQL Security</h1>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-cyan-700">What is SQL Injection?</h2>
                            <p className="leading-relaxed">
                                SQL Injection (SQLi) occurs when an attacker inserts malicious SQL code into an entry field for execution.
                                This can allow unauthorized parties to view data they are not normally able to retrieve, or even delete entire tables.

                                <span className="block text-rose-500 font-bold mt-2">
                                    Example:
                                </span>

                                If a login form directly concatenates user input into a SQL query, an attacker could input something like{" "}
                                <code className="bg-slate-100 px-1 rounded text-sm text-rose-400">
                                    ' OR '1'='1
                                </code>
                                , which would make the query return all users instead of just the intended one.
                            </p>

                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                                <p className="text-sm text-amber-800 font-medium italic">
                                    "Each command type (DML, DDL, DCL) can be used by attackers to compromise confidentiality, integrity, or availability".
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-lg p-6 text-cyan-400 font-mono text-sm shadow-inner">
                            <p className="text-slate-500 mb-2">// Malicious Example</p>
                            <p>SELECT * FROM users WHERE id = <span className="text-rose-400">'1' OR '1'='1'</span>;</p>
                            <p className="mt-4 text-slate-500">// Effect: Returns EVERY user in the database because '1'='1' is always true[cite: 1].</p>
                        </div>
                    </section>

                    <h3 className="text-xl font-bold mb-4">The Employees Table</h3>
                    <div className="overflow-hidden border rounded-lg mb-10">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-slate-100 border-b">
                                <tr>
                                    {['userid', 'first_name', 'last_name', 'department', 'salary'].map(h => (
                                        <th key={h} className="px-4 py-3 font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { id: '32147', fn: 'Paulina', ln: 'Travers', dept: 'Accounting', sal: '$46,000' },
                                    { id: '96134', fn: 'Bob', ln: 'Franco', dept: 'Marketing', sal: '$83,700' },
                                    { id: '37648', fn: 'John', ln: 'Smith', dept: 'Marketing', sal: '$64,350' }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">{row.id}</td>
                                        <td className="px-4 py-3">{row.fn}</td>
                                        <td className="px-4 py-3">{row.ln}</td>
                                        <td className="px-4 py-3 font-semibold text-cyan-700">{row.dept}</td>
                                        <td className="px-4 py-3">{row.sal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <section className="bg-cyan-50 rounded-xl p-8 border border-cyan-100">
                        <h2 className="text-3xl font-light mb-4">It is your turn!</h2>
                        <p className="mb-6 text-slate-700">
                            Retrieve the <strong>department</strong> for <strong>Bob Franco</strong>.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <label className="font-bold text-slate-600 text-sm whitespace-nowrap">SQL QUERY</label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Put your answer here"
                                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 outline-none transition-all font-mono text-sm"
                                />
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-slate-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-700 transition-all shadow-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>

                        {feedback.message && (
                            <div className="mt-6 space-y-3">
                                <div className={`p-4 rounded-t-lg border-2 border-b-0 font-bold ${feedback.type === 'error' ? 'bg-rose-100 border-rose-200 text-rose-700' :
                                    feedback.type === 'success' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' :
                                        'bg-blue-100 border-blue-200 text-blue-700'
                                    }`}>
                                    {feedback.message}
                                </div>

                                <div className={`p-4 rounded-b-lg border-2 bg-white text-sm leading-relaxed ${feedback.type === 'error' ? 'border-rose-200 text-rose-900' :
                                    feedback.type === 'success' ? 'border-emerald-200 text-emerald-900' :
                                        'border-blue-200 text-blue-900'
                                    }`}>
                                    <h4 className="font-bold uppercase tracking-wider text-xs mb-2">Deep Dive Explanation:</h4>
                                    {feedback.explanation}
                                </div>
                            </div>
                        )}

                        {isCompleted && (
                            <div className='mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between'>
                                <div>
                                    <h3 className="text-lg font-bold text-emerald-700">
                                        Lesson Completed!
                                    </h3>
                                    <p className="text-sm text-emerald-900">
                                        You have successfully completed the SQL Injection lesson. Become a better developer by understanding how to write secure SQL queries and protect against injection attacks.
                                    </p>
                                </div>

                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-200 text-emerald-800">
                                    COMPLETED
                                </span>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Lesson;