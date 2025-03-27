import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../config';
import './Programs.css';

const Programs = () => {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (programId) {
      fetchProgramDetails();
      fetchCohorts();
    }
  }, [programId]);

  const fetchProgramDetails = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/startup/programs/${programId}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('access_token') ||
              sessionStorage.getItem('access_token')
            }`,
          },
        }
      );
      setProgram(response.data);
    } catch (error) {
      console.error('Error fetching program details:', error);
    }
  };

  const fetchCohorts = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/startup/programs/${programId}/cohorts`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('access_token') ||
              sessionStorage.getItem('access_token')
            }`,
          },
        }
      );
      setCohorts(response.data);
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const fetchCohortDetails = async (cohortId) => {
    try {
      const [tasksRes, membersRes, mentorsRes, adminsRes, documentsRes] = await Promise.all([
        axios.get(`${config.api_base_url}/startup/cohorts/${cohortId}/tasks`),
        axios.get(`${config.api_base_url}/startup/cohorts/${cohortId}/members`),
        axios.get(`${config.api_base_url}/startup/cohorts/${cohortId}/mentors`),
        axios.get(`${config.api_base_url}/startup/cohorts/${cohortId}/admins`),
        axios.get(`${config.api_base_url}/startup/cohorts/${cohortId}/documents`),
      ]);

      setTasks(tasksRes.data);
      setMembers(membersRes.data);
      setMentors(mentorsRes.data);
      setAdmins(adminsRes.data);
      setDocuments(documentsRes.data);
    } catch (error) {
      console.error('Error fetching cohort details:', error);
    }
  };

  const handleCohortSelect = (cohort) => {
    setSelectedCohort(cohort);
    fetchCohortDetails(cohort.id);
  };

  return (
    <div className="programs-container">
      <div className="program-header">
        <h1>{program?.name}</h1>
        <p className="program-description">{program?.description}</p>
      </div>

      <div className="cohorts-section">
        <h2>Cohorts</h2>
        <div className="cohorts-list">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className={`cohort-card ${selectedCohort?.id === cohort.id ? 'active' : ''}`}
              onClick={() => handleCohortSelect(cohort)}
            >
              <h3>{cohort.name}</h3>
              <div className="cohort-meta">
                <span>Start: {new Date(cohort.start_date).toLocaleDateString()}</span>
                <span>End: {new Date(cohort.end_date).toLocaleDateString()}</span>
              </div>
              <span className={`status-badge ${cohort.status.toLowerCase()}`}>
                {cohort.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedCohort && (
        <div className="cohort-details">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button
              className={`tab ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              Members
            </button>
            <button
              className={`tab ${activeTab === 'mentors' ? 'active' : ''}`}
              onClick={() => setActiveTab('mentors')}
            >
              Mentors
            </button>
            <button
              className={`tab ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              Admins
            </button>
            <button
              className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'tasks' && (
              <div className="tasks-list">
                {tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <h4>{task.name}</h4>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                      <span className={`status-badge ${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="members-list">
                {members.map((member) => (
                  <div key={member.id} className="member-card">
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                    <p>{member.role}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'mentors' && (
              <div className="mentors-list">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="mentor-card">
                    <h4>{mentor.name}</h4>
                    <p>{mentor.expertise}</p>
                    <p>{mentor.email}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'admins' && (
              <div className="admins-list">
                {admins.map((admin) => (
                  <div key={admin.id} className="admin-card">
                    <h4>{admin.name}</h4>
                    <p>{admin.email}</p>
                    <p>{admin.role}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="documents-list">
                {documents.map((document) => (
                  <div key={document.id} className="document-card">
                    <h4>{document.name}</h4>
                    <p>{document.description}</p>
                    <a href={document.url} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
