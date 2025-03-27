import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../../../config';
import './Tasks.css';

const Tasks = ({ cohortId }) => {
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
      const response = await axios.get(`${config.api_base_url}/cohort/task/${cohortId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
          }`,
        },
      });
      setTasks(response.data);
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

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedTasks = tasks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tasks-container">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Due Date</th>
              <th>Description</th>
              <th>Discription</th>
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

      <div className="pagination">
        <div className="rows-per-page">
          <span>1-{rowsPerPage} of {tasks.length}</span>
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="page-navigation">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
