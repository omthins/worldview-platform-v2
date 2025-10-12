import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WorldviewCard from '../components/worldview/WorldviewCard';
import { API_ENDPOINTS, apiRequest } from '../utils/api';
import './Home.css';

const Home = () => {
  const [worldviews, setWorldviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorldviews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('开始获取世界观列表...');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20 // 增加每页显示数量
      });

      const data = await apiRequest(`${API_ENDPOINTS.WORLDVIEWS}?${params}`);
      console.log('获取到的世界观数据:', data);
      
      setWorldviews(data.worldviews);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('获取世界观列表失败:', err);
      setError(err.message || '获取世界观列表失败');
      setLoading(false);
    }
  };

    fetchWorldviews();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>探索无限的世界观</h1>
          <p>发现、创建和分享各种精彩的世界观设定</p>
          <Link to="/create-worldview" className="btn btn-primary btn-lg">
            创建你的世界观
          </Link>
        </div>
      </div>

      <div className="worldviews-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-state">
            <h3>加载失败</h3>
            <p>{error}</p>
            <button className="btn" onClick={() => window.location.reload()}>重试</button>
          </div>
        ) : worldviews && worldviews.length > 0 ? (
          <>
            <div className="worldviews-grid">
              {worldviews.map(worldview => (
                <WorldviewCard key={worldview.id} worldview={worldview} showNumber={true} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              上一页
            </button>
            
            <span className="page-info">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              下一页
            </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h3>没有找到世界观</h3>
            <p>试试调整搜索条件或创建一个新的世界观</p>
            <Link to="/create-worldview" className="btn">创建世界观</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;