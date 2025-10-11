import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WorldviewCard from '../components/worldview/WorldviewCard';
import './Home.css';

const Home = () => {
  const [worldviews, setWorldviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWorldviews = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage,
          limit: 16 // 改为每页16个，以适应4x4的网格布局
        });

        const res = await fetch(`/api/worldviews?${params}`);
        const data = await res.json();
        
        setWorldviews(data.worldviews);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('获取世界观列表失败:', err);
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