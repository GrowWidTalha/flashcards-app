import React, { useState, useEffect } from 'react';
import { reportsApi } from '../services/api';

const Reports = () => {
    const [reports, setReports] = useState({
        userActivity: [],
        quizPerformance: [],
        systemMetrics: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('userActivity');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [userActivityRes, quizPerformanceRes, systemMetricsRes] = await Promise.all([
                    reportsApi.getAll(),
                    reportsApi.getQuizPerformance(),
                    reportsApi.getSystemMetrics()
                ]);

                setReports({
                    userActivity: userActivityRes.data,
                    quizPerformance: quizPerformanceRes.data,
                    systemMetrics: systemMetricsRes.data
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch reports');
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    const renderUserActivity = () => (
        <div className="space-y-4">
            {reports.userActivity.map((activity) => (
                <div key={activity._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold">{activity.userName}</h3>
                            <p className="text-gray-600">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm"
                            style={{ backgroundColor: activity.type === 'login' ? '#e6f3ff' : '#fff3e6' }}>
                            {activity.type}
                        </span>
                    </div>
                    <p className="mt-2 text-gray-700">{activity.description}</p>
                </div>
            ))}
        </div>
    );

    const renderQuizPerformance = () => (
        <div className="space-y-4">
            {reports.quizPerformance.map((quiz) => (
                <div key={quiz._id} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-600">Total Attempts</p>
                            <p className="text-xl font-bold">{quiz.totalAttempts}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Average Score</p>
                            <p className="text-xl font-bold">{quiz.averageScore}%</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Completion Rate</p>
                            <p className="text-xl font-bold">{quiz.completionRate}%</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Average Time</p>
                            <p className="text-xl font-bold">{quiz.averageTime} min</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSystemMetrics = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">System Health</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>CPU Usage</span>
                        <span>{reports.systemMetrics.cpuUsage}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Memory Usage</span>
                        <span>{reports.systemMetrics.memoryUsage}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Active Users</span>
                        <span>{reports.systemMetrics.activeUsers}</span>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Response Time</span>
                        <span>{reports.systemMetrics.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Error Rate</span>
                        <span>{reports.systemMetrics.errorRate}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Uptime</span>
                        <span>{reports.systemMetrics.uptime}%</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === 'userActivity' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('userActivity')}
                >
                    User Activity
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === 'quizPerformance' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('quizPerformance')}
                >
                    Quiz Performance
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === 'systemMetrics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('systemMetrics')}
                >
                    System Metrics
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === 'userActivity' && renderUserActivity()}
                {activeTab === 'quizPerformance' && renderQuizPerformance()}
                {activeTab === 'systemMetrics' && renderSystemMetrics()}
            </div>
        </div>
    );
};

export default Reports;
