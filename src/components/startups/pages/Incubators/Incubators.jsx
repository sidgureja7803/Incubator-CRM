import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import { useNavigate, useLocation, NavLink, Outlet } from 'react-router-dom';
import './Incubators.css';
import IncubatorLogo from '../../pages/Dashboard/IncuabtorImage.png';
import MyIncubators from './MyIncubators/MyIncubators';
import ApplyIncubation from './ApplyIncubation/ApplyIncubation';

const Incubators = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('apply') ? 'apply' : 'my-incubators'
  );
  const [incubators, setIncubators] = useState([]);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [cohortTab, setCohortTab] = useState('documents');
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [isSubmitPopupVisible, setIsSubmitPopupVisible] = useState(false);

  useEffect(() => {
    fetchIncubators();
  }, []);

  const fetchIncubators = async () => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/startup/startupincubator/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setIncubators(response.data);
    } catch (error) {
      console.error('Error fetching incubators:', error);
    }
  };

  const handleIncubatorClick = async (incubator) => {
    if (activeTab === 'my-incubators') {
      try {
        const response = await axios.get(
          `${config.api_base_url}/startup/incubators/${incubator.id}/programs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
            },
          }
        );
        setSelectedIncubator({
          ...incubator,
          programs: response.data
        });
        setSelectedProgram(null);
        setSelectedCohort(null);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    } else {
      try {
        const response = await axios.get(
          `${config.api_base_url}/startup/incubators/program-questions/${incubator.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
            },
          }
        );
        setQuestions(response.data);
        const initialFormData = {};
        response.data.forEach((question) => {
          initialFormData[question.id] = '';
        });
        setFormData(initialFormData);
        setSelectedIncubator(incubator);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
  };

  const handleProgramClick = async (program) => {
    try {
      const response = await axios.get(
        `${config.api_base_url}/startup/programs/${program.id}/cohorts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          },
        }
      );
      setSelectedProgram({
        ...program,
        cohorts: response.data
      });
      setSelectedCohort(null);
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const handleCohortClick = (cohort) => {
    setSelectedCohort(cohort);
    setCohortTab('documents');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    submitAnswers('save').finally(() => {
      setIsLoading(false);
    });
  };

  const handleSubmit = () => {
    setIsSubmitPopupVisible(true);
  };

  const confirmSubmit = () => {
    submitAnswers('submit');
    setIsSubmitPopupVisible(false);
  };

  const submitAnswers = (action) => {
    const transformedPayload = {
      action: action,
      answers: Object.entries(formData)
        .filter(([questionId, answer]) => questionId && answer !== '')
        .map(([questionId, answer]) => ({
          program_question_id: parseInt(questionId, 10),
          answer: answer || '',
        })),
    };

    return axios.post(
      `${config.api_base_url}/startup/incubators/program-questions/submit-answers/`,
      transformedPayload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
        },
      }
    )
    .then((response) => {
      if (action === 'save') {
        setIsSuccessPopupVisible(true);
        setTimeout(() => setIsSuccessPopupVisible(false), 3000);
      }
      setSelectedIncubator(null);
      setFormData({});
      setQuestions([]);
    })
    .catch((error) => {
      console.error('Error saving form:', error.response?.data || error);
      alert(`Error: ${error.response?.data?.error || 'An error occurred'}`);
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'my-incubators') {
      navigate('/startup/incubators/my-incubators');
    } else if (tab === 'apply') {
      navigate('/startup/incubators/apply');
    }
  };

  return (
    <div className="incubators-container">
      <h2 className="page-title">Incubators</h2>
      
      <div className="tab-navigation">
        <NavLink 
          to="/startup/incubators/my-incubators" 
          className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
        >
          My Incubators
        </NavLink>
        <NavLink 
          to="/startup/incubators/apply" 
          className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
        >
          Apply
        </NavLink>
      </div>
      
      <Outlet />

      {isSuccessPopupVisible && (
        <div className="success-popup">
          Application saved successfully!
        </div>
      )}

      {isSubmitPopupVisible && (
        <div className="submit-popup">
          <h3>Confirm Submission</h3>
          <p>Are you sure you want to submit your application? This action cannot be undone.</p>
          <div className="popup-actions">
            <button onClick={() => setIsSubmitPopupVisible(false)}>Cancel</button>
            <button onClick={confirmSubmit}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incubators; 