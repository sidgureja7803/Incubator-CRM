import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'utils/httpClient';
import config from "../../../../../config";
import './Tasks.css';

const Tasks = () => {
  const { incubatorId, programId, cohortId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingTask, setEditingTask] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [cohortId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Mock tasks data for demonstration
      const mockTasks = [
        {
          id: 1,
          task_name: "Research Work",
          due_date: "2023-12-11",
          description: "Do the Editing and research work for the start up",
          assigned_by_name: "Mr Kanishk Dadwal"
        },
        {
          id: 2,
          task_name: "Research Work",
          due_date: "2024-12-11",
          description: "Do the Editing and research work for the start up",
          assigned_by_name: "Mr Pratham Anand"
        },
        {
          id: 3,
          task_name: "Research Work",
          due_date: "2024-10-12",
          description: "Do the Editing and research work for the start up",
          assigned_by_name: "Mr Kanishk Dadwal"
        },
        {
          id: 4,
          task_name: "Research Work",
          due_date: "2024-11-12",
          description: "Do the Editing and research work for the start up",
          assigned_by_name: "Mr Pratham Anand"
        }
      ];
      
      setTasks(mockTasks);
      
      /*
      // Uncomment to use the actual API
      const response = await axios.get(`${config.api_base_url}/cohort/task/${cohortId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
          }`,
        },
      });
      setTasks(response.data);
      */
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setRemarks(task.remarks || '');
  };

  const handleSaveRemarks = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${config.api_base_url}/cohort/task/${editingTask.id}`,
        { remarks },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
            }`,
          },
        }
      );
      
      // Update the task in the local state
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? { ...task, remarks } : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
      setRemarks('');
      setError(null);
    } catch (err) {
      setError('Failed to update remarks');
      console.error('Error updating remarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (tab) => {
    navigate(`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/${tab}`);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedTasks = tasks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  if (loading) return <div className="loading-message">Loading tasks...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="cohort-tasks-container">
      <div className="cohort-tabs">
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/tasks`}
          className={({isActive}) => isActive ? "tab active" : "tab"}
        >
          Tasks
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/members`}
          className={({isActive}) => isActive ? "tab active" : "tab"}
        >
          Members
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/mentors`}
          className={({isActive}) => isActive ? "tab active" : "tab"}
        >
          Mentors
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/admins`}
          className={({isActive}) => isActive ? "tab active" : "tab"}
        >
          Admins
        </NavLink>
        <NavLink 
          to={`/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/documents`}
          className={({isActive}) => isActive ? "tab active" : "tab"}
        >
          Documents
        </NavLink>
      </div>

      <div className="tasks-content">
        <div className="tasks-table">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Due Date</th>
                <th>Description</th>
                <th>Description</th>
                <th>Assigned By</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {displayedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.task_name}</td>
                  <td>{new Date(task.due_date).toLocaleDateString()}</td>
                  <td>{task.description}</td>
                  <td>{task.description}</td>
                  <td>{task.assigned_by_name}</td>
                  <td>
                    {editingTask?.id === task.id ? (
                      <div className="remarks-editor">
                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add your remarks here..."
                        />
                        <div className="remarks-actions">
                          <button
                            className="save-btn"
                            onClick={handleSaveRemarks}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditingTask(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="remarks-display">
                        <span>{task.remarks || 'No remarks'}</span>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(task)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="rows-info">
            <span>1-{Math.min(rowsPerPage, tasks.length)} of {tasks.length}</span>
            <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
