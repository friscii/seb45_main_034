import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import userimg from '../images/userimg.png'
import UserProfileMenu from "./profilemenu";
import { FaPlus } from 'react-icons/fa';
import Logo from "../images/icon.png"
import './CSS/header.css'

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

function Header() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [userProfileImageLink, setUserProfileImageLink] = useState(userimg);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const userRoles = Cookies.get("userRoles");

    if (userRoles) {
      setIsAdmin(userRoles === "ADMIN");
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      setIsLogged(true);
      fetchUserProfileImage();
    } else {
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfileImage();
  }, []);

  const fetchUserProfileImage = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        return;
      }

      const response = await instance.get(`/api/users/info/${userId}`);
      const userProfileImageLink = response.data.proFilePicture;

      setUserProfileImageLink(userProfileImageLink || userimg);
    } catch (error) {
      console.error("프로필 이미지를 가져오지 못했습니다.", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSingup = () => {
    navigate("/signup");
  };

  const handleProfileClick = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(!isOpen);
  };

  const handleAddMovie = () => {
    navigate('/movie/add')
  }

  const handleSearch = () => {
    if (searchKeyword) {
      navigate(`/movie/search?keyword=${searchKeyword}`);
    }
  };

  return (
    <div className="header">
  <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <h1 className="header-title">
    <img className="header-logo" src={Logo} alt="Mini Flix Icon" />
    MINIFLIX
  </h1>
  </Link>
  <div className="header-search">
    <div className="search-container">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button className="search-button" onClick={handleSearch}>검색</button>
    </div>
  </div>
  <div className="header-buttons">
        {isLogged ? (
          <>
            <div className="profile-image-container">
            <img src={userProfileImageLink || userimg} alt="User Profile" onClick={handleProfileClick} />
              {isMenuOpen && <UserProfileMenu userProfileImageLink={userProfileImageLink} onClose={() => setIsMenuOpen(false)} />}
            </div>
            {isAdmin && (
              <button className="add-movie-button" onClick={handleAddMovie}>
                <FaPlus />
              </button>
              )}
          </>
        ) : (
          <>
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            <button className="join-button" onClick={handleSingup}>
              Singup
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;