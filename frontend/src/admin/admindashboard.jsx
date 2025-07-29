import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const navigateTo = (section) => {
        switch(section) {
            case 'user-management':
                alert('Navigating to User Management...');
                break;
            case 'pending-approvals':
                alert('Navigating to Pending Approvals...');
                break;
            case 'live-chat':
                alert('Opening Live Chat Monitor...');
                break;
            case 'system-analytics':
                alert('Loading System Analytics...');
                break;
        }
    };

    return (
        <div>
            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    color: #333;
                }
                
                .header {
                    background: white;
                    padding: 20px;
                    border-bottom: 1px solid #ddd;
                }
                
                .header h1 {
                    font-size: 28px;
                    margin-bottom: 5px;
                }
                
                .header p {
                    color: #666;
                }
                
                .controls {
                    float: right;
                    margin-top: -40px;
                }
                
                .controls select, .controls button {
                    padding: 8px 16px;
                    margin-left: 10px;
                    border: 1px solid #ddd;
                    background: white;
                    cursor: pointer;
                }
                
                .dashboard-content {
                    padding: 30px;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 40px;
                }
                
                .stat-card {
                    background: white;
                    padding: 25px;
                    border: 1px solid #ddd;
                    text-align: center;
                }
                
                .stat-card h3 {
                    font-size: 12px;
                    text-transform: uppercase;
                    color: #666;
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                }
                
                .stat-card .number {
                    font-size: 36px;
                    font-weight: bold;
                    color: #333;
                }
                
                .quick-actions {
                    background: white;
                    padding: 25px;
                    border: 1px solid #ddd;
                }
                
                .quick-actions h2 {
                    margin-bottom: 5px;
                }
                
                .quick-actions p {
                    color: #666;
                    margin-bottom: 25px;
                }
                
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                }
                
                .action-card {
                    padding: 30px 20px;
                    border: 1px solid #ddd;
                    text-align: center;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .action-card:hover {
                    background-color: #f9f9f9;
                }
                
                .action-card h3 {
                    margin-bottom: 8px;
                    font-size: 16px;
                }
                
                .action-card p {
                    font-size: 14px;
                    color: #666;
                }
                
                .live-chat-badge {
                    display: inline-block;
                    background: #28a745;
                    color: white;
                    padding: 2px 8px;
                    font-size: 12px;
                    margin-left: 10px;
                }
                
                .clear {
                    clear: both;
                }
                
                @media (max-width: 768px) {
                    .stats-grid, .actions-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .controls {
                        float: none;
                        margin-top: 20px;
                    }
                }
                
                @media (max-width: 480px) {
                    .stats-grid, .actions-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back to your command center</p>
                
                <div className="controls">
                    <select>
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>Last 3 months</option>
                    </select>
                    <button>Export Report</button>
                </div>
                <div className="clear"></div>
            </div>

            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <div className="number">0</div>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Active Bookings</h3>
                        <div className="number">0</div>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Platform Revenue</h3>
                        <div className="number">0</div>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Pending Approvals</h3>
                        <div className="number">0</div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <p>Streamline your workflow</p>
                    
                    <div className="actions-grid">
                        <div className="action-card" onClick={() => navigate('/admin/usermanagement')}>
                            <h3>User Management</h3>
                            <p>Manage all platform users</p>
                        </div>
                        
                        <div className="action-card" onClick={() => navigate('/admin/pendingapprovels')}>
                            <h3>Pending Approvals</h3>
                            <p>Review registration requests</p>
                        </div>
                        
                        <div className="action-card" onClick={() => navigateTo('live-chat')}>
                            <h3>Live Chat Monitor<span className="live-chat-badge">0</span></h3>
                            <p>Monitor customer support</p>
                        </div>
                        
                        <div className="action-card" onClick={() => navigateTo('system-analytics')}>
                            <h3>System Analytics</h3>
                            <p>View detailed analytics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}