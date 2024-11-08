import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Concentration {
    area: string;
    major: string;
    degreeType: string;
    numberAwarded: number;
    year: string;
}

const CollegePage = () => {
    const [state, setState] = useState('');
    const [concentrations, setConcentrations] = useState<Concentration[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value);
    };

    const fetchConcentrationData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:4001/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query ($state: String!) {
                            states(name: $state) {
                                collegeConcentrations {
                                    area
                                    major
                                    degreeType
                                    numberAwarded
                                    year
                                }
                            }
                        }
                    `,
                    variables: { state }
                }),
            });

            const result = await response.json();
            if (result.errors) {
                setError("Error fetching data. Please try again.");
            } else {
                setConcentrations(result.data.states[0].collegeConcentrations);
            }
        } catch (err) {
            setError("An error occurred while fetching data.");
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>College Concentrations by State</h2>
            <input
                type="text"
                value={state}
                onChange={handleStateChange}
                placeholder="Enter state"
            />
            <button onClick={fetchConcentrationData}>Fetch Data</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* Visualization */}
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart data={concentrations} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="numberAwarded" fill="#3182ce" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Table for all results */}
                    <table>
                        <thead>
                            <tr>
                                <th>Area</th>
                                <th>Major</th>
                                <th>Degree Type</th>
                                <th>Number Awarded</th>
                                <th>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {concentrations.map((concentration, index) => (
                                <tr key={index}>
                                    <td>{concentration.area}</td>
                                    <td>{concentration.major}</td>
                                    <td>{concentration.degreeType}</td>
                                    <td>{concentration.numberAwarded}</td>
                                    <td>{concentration.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default CollegePage;
