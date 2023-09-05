import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaClock, FaFilter } from 'react-icons/fa';
import './CSS/button.css'

interface SideBarProps {
  setSelectedCategory: (category: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ setSelectedCategory }) => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState<boolean>(false);

  const handleHomeClick = () => {
    setSelectedCategory('');
    navigate('/');
  };

  const handleCategoriesClick = () => {
    setShowCategories(!showCategories); // 카테고리 토글
  };

  const handleGenreClick = (genre: string) => {
    setSelectedCategory(genre);
    navigate(`/genres/${genre}`);
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  return (
    <aside className="sidebar">
      <button onClick={handleHomeClick} className="home-button">
        <FaHome className="home-icon" />
        <span className="home-text">홈</span>
      </button>
      <button onClick={handleCategoriesClick}>
        <FaFilter className="filter-icon" />
        <span className='filter-text'>카테고리</span>
      </button>
      <div className={`side-list ${showCategories ? 'show' : ''}`}>
        <button onClick={() => handleGenreClick('SF')}>SF</button>
        <button onClick={() => handleGenreClick('무료')}>무료</button>
        <button onClick={() => handleGenreClick('공포')}>공포</button>
        <button onClick={() => handleGenreClick('테스트')}>테스트</button>
      </div>
      <button onClick={handleHistoryClick}>
        <FaClock className="history-icon" />
        <span className="history-text">시청 기록</span>
      </button>
    </aside>
  );
};

export default SideBar;