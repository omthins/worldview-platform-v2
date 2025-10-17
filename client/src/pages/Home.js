import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import WorldviewCard from '../components/worldview/WorldviewCard';
import { API_ENDPOINTS, apiRequest } from '../utils/api';
import './Home.css';

const Home = () => {
  const [worldviews, setWorldviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchWorldviews = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('开始获取世界观列表...');
        
        // 构建查询参数
        const params = new URLSearchParams({
          page: currentPage,
          limit: 20
        });

        // 添加搜索参数
        const search = searchParams.get('search');
        const worldview = searchParams.get('worldview');
        const creator = searchParams.get('creator');
        const id = searchParams.get('id');
        const wid = searchParams.get('wid');

        if (search) {
          params.append('search', search);
        }
        if (worldview) {
          params.append('worldview', worldview);
        }
        if (creator) {
          params.append('creator', creator);
        }
        if (id) {
          params.append('id', id);
        }
        if (wid) {
          params.append('wid', wid);
        }

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
  }, [currentPage, location.search, searchParams]);

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
            <div className="worldviews-list">
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
            <h3>
              {searchParams.get('creator') ? '没有找到该创作者的世界观' : 
               searchParams.get('worldview') ? '没有找到匹配的世界观' :
               searchParams.get('id') ? '没有找到该UUID的世界观' :
               searchParams.get('wid') ? '没有找到该编号的世界观' :
               '没有找到世界观'}
            </h3>
            <p>试试调整搜索条件</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;