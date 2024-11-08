import React, { useState } from 'react';

interface CommuteTimeData {
    travelTime: string;
    numberOfPeople: number;
}

interface CommuteMethodData {
    method: string;
    numberOfCommuters: number;
}

interface StateCommuteData {
    commuteTimes: CommuteTimeData[];
    commuteMethods: CommuteMethodData[];
}

const getMinutesFromRange = (range: string): number => {
    const mapping: { [key: string]: number } = {
        "< 5 Minutes": 2.5,
        "5-9 Minutes": 7,
        "10-14 Minutes": 12,
        "15-19 Minutes": 17,
        "20-24 Minutes": 22,
        "25-29 Minutes": 27,
        "30-34 Minutes": 32,
        "35-39 Minutes": 37,
        "40-44 Minutes": 42,
        "45-59 Minutes": 52,
        "60-89 Minutes": 75,
        "90+ Minutes": 95
    };
    return mapping[range] || 0;
};

const getAverageCommuteTime = (commuteTimes: CommuteTimeData[]): string => {
    let totalCommuteTime = 0;
    let totalPeople = 0;

    commuteTimes.forEach((data) => {
        const minutes = getMinutesFromRange(data.travelTime);
        totalCommuteTime += minutes * data.numberOfPeople;
        totalPeople += data.numberOfPeople;
    });

    return totalPeople > 0 ? (totalCommuteTime / totalPeople).toFixed(2) : "N/A";
};

const getMostPopularMethod = (commuteMethods: CommuteMethodData[]) => {
    return commuteMethods.reduce((a, b) => (a.numberOfCommuters > b.numberOfCommuters ? a : b)).method;
};

const getTotalCommuters = (commuteMethods: CommuteMethodData[]) => {
    return commuteMethods.reduce((sum, d) => sum + d.numberOfCommuters, 0);
};

const CommutePage = () => {
    const [state1, setState1] = useState('');
    const [state2, setState2] = useState('');
    const [year, setYear] = useState('');
    const [data1, setData1] = useState<StateCommuteData | null>(null);
    const [data2, setData2] = useState<StateCommuteData | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!state1 || !state2 || !year) {
            setError('Please enter two states and a year.');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:4001/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query ($state1: String!, $state2: String!, $year: String!) {
                            state1: states(name: $state1) {
                                commuteTimes(year: $year) {
                                    travelTime
                                    numberOfPeople
                                }
                                commuteMethods(year: $year) {
                                    method
                                    numberOfCommuters
                                }
                            }
                            state2: states(name: $state2) {
                                commuteTimes(year: $year) {
                                    travelTime
                                    numberOfPeople
                                }
                                commuteMethods(year: $year) {
                                    method
                                    numberOfCommuters
                                }
                            }
                        }
                    `,
                    variables: { state1, state2, year }
                }),
            });

            const result = await response.json();
            if (result.errors) {
                setError("Error fetching data. Please try again.");
            } else {
                setData1({
                    commuteTimes: result.data.state1[0].commuteTimes,
                    commuteMethods: result.data.state1[0].commuteMethods,
                });
                setData2({
                    commuteTimes: result.data.state2[0].commuteTimes,
                    commuteMethods: result.data.state2[0].commuteMethods,
                });
            }
        } catch (err) {
            setError("An error occurred while fetching data.");
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Compare Commute Information</h2>
            <input
                type="text"
                value={state1}
                onChange={(e) => setState1(e.target.value)}
                placeholder="Enter first state"
            />
            <input
                type="text"
                value={state2}
                onChange={(e) => setState2(e.target.value)}
                placeholder="Enter second state"
            />
            <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Enter year"
            />
            <button onClick={handleSearch}>Compare</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {data1 && data2 && (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div>
                                <h3>{state1} - {year}</h3>
                                <p><strong>Average Commute Time:</strong> {getAverageCommuteTime(data1.commuteTimes)} mins</p>
                                <p><strong>Most Popular Commute Method:</strong> {getMostPopularMethod(data1.commuteMethods)}</p>
                                <p><strong>Total Commuters:</strong> {getTotalCommuters(data1.commuteMethods)}</p>
                            </div>
                            <div>
                                <h3>{state2} - {year}</h3>
                                <p><strong>Average Commute Time:</strong> {getAverageCommuteTime(data2.commuteTimes)} mins</p>
                                <p><strong>Most Popular Commute Method:</strong> {getMostPopularMethod(data2.commuteMethods)}</p>
                                <p><strong>Total Commuters:</strong> {getTotalCommuters(data2.commuteMethods)}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommutePage;
