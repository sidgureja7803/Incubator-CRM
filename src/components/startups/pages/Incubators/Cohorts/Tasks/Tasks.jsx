import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import config from "config";
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
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [incubatorId, programId, cohortId, currentPage, rowsPerPage]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      const response = await axios.get(
        `${config.api_base_url}/startup/incubators/${incubatorId}/programs/${programId}/cohorts/${cohortId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            page: currentPage,
            limit: rowsPerPage
          }
        }
      );
      
      if (response.data) {
        setTasks(response.data.items || []);
        setTotalTasks(response.data.total || 0);
      } else {
        setTasks([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalTasks / rowsPerPage);
    if (currentPage < maxPage) {
      setCurrentPage(prev => prev + 1);
    }
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

  const startRange = (currentPage - 1) * rowsPerPage + 1;
  const endRange = Math.min(currentPage * rowsPerPage, totalTasks);

  if (loading && tasks.length === 0) {
    return <div className="tasks-loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="tasks-error">{error}</div>;
  }

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
        <div className="tasks-table-wrapper">
          <table className="tasks-table">
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
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-tasks">No tasks available</td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{new Date(task.due_date).toLocaleDateString()}</td>
                    <td>{task.description}</td>
                    <td>{task.description}</td>
                    <td>{task.assigned_by}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="tasks-pagination">
          <div className="pagination-info">
            {tasks.length > 0 && (
              <span>{startRange} - {endRange} of {totalTasks}</span>
            )}
          </div>
          <div className="pagination-controls">
            <label>
              Rows per page:
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
            <button 
              className="pagination-button" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <button 
              className="pagination-button" 
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(totalTasks / rowsPerPage)}
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
