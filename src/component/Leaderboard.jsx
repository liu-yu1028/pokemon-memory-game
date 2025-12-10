import "./Leaderboard.css"
import { useEffect, useState } from 'react';
import { getPersonalBestRecords } from '../gameService';
import { useAuth } from '../contexts/AuthContext';

export default function Leaderboard({isOpen, onClose, refreshTrigger}) {
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRecords, setFilteredRecords] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [difficultyFilter, setDifficultyFilter] = useState("normal") // 預設普通模式
  const { currentUser } = useAuth();

  const recordsPerPage = 10

  useEffect(() => {
    if (isOpen && currentUser) {
      loadRecords();
    }
  }, [isOpen, currentUser, refreshTrigger]);

  // 過濾記錄並回到第一頁
  useEffect(() => {
    filterRecords()
    setCurrentPage(1)
  }, [difficultyFilter, allRecords])

  const loadRecords = async () => {
    setLoading(true);
    const data = await getPersonalBestRecords(currentUser.uid);
    setAllRecords(data);
    setLoading(false);
  };

  const filterRecords = () => {
    if(difficultyFilter === "all") {
      setFilteredRecords(allRecords)
    } else {
      setFilteredRecords(allRecords.filter(record => record.difficulty === difficultyFilter))
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 計算分頁
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = filteredRecords.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if(currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum)
  }

  // 取得排名顯示(分開計算)
  const getRankDisplay = (index) => {
    const rank = startIndex + index + 1;
    
    // 如果是「全部」模式,不顯示獎牌
    if (difficultyFilter === 'all') {
      return rank;
    }
    
    // 分開計算排名時,前三名顯示獎牌
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  // 判斷是否為最佳記錄(只有第一名)
  const isBestRecord = (index) => {
    if (difficultyFilter === 'all') return false;
    return startIndex + index === 0;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏆 個人最佳記錄</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 難度篩選 */}
        <div className="filter-section">
          <div className="filter-buttons">
            <button 
              className={`filter-btn normal ${difficultyFilter === "normal" ? "active" : ""}`} 
              onClick={() => setDifficultyFilter("normal")}
            >
              普通 ({allRecords.filter(r => r.difficulty === "normal").length})
            </button>
            <button 
              className={`filter-btn hard ${difficultyFilter === "hard" ? "active" : ""}`} 
              onClick={() => setDifficultyFilter("hard")}
            >
              困難 ({allRecords.filter(r => r.difficulty === "hard").length})
            </button>
            <button 
              className={`filter-btn ${difficultyFilter === "all" ? "active" : ""}`} 
              onClick={() => setDifficultyFilter("all")}
            >
              全部 ({allRecords.length})
            </button>
          </div>

          {/* 說明文字 */}
          <div className="filter-description">
            {difficultyFilter === 'normal' && (
              <p>普通模式排行榜 － 一階 → 二階進化配對</p>
            )}
            {difficultyFilter === 'hard' && (
              <p>困難模式排行榜 － 一階 → 三階進化配對</p>
            )}
            {difficultyFilter === 'all' && (
              <p>所有遊戲記錄 － 混合顯示</p>
            )}
          </div>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">載入中...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="no-records-modal">
              <p>還沒有記錄</p>
              <p className="hint">
                {difficultyFilter === 'all' 
                  ? '完成遊戲後會自動儲存記錄' 
                  : `還沒有${difficultyFilter === 'normal' ? '普通' : '困難'}模式的記錄！`}
              </p>
            </div>
          ) : (
            <>
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>排名</th>
                    {difficultyFilter === 'all' && <th>難度</th>}
                    <th>時間</th>
                    <th>翻牌</th>
                    <th>日期</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record, index) => (
                    <tr key={record.id} className={isBestRecord(index) ? 'best-record' : ''}>
                      <td className="rank">
                        {getRankDisplay(index)}
                      </td>
                      {difficultyFilter === 'all' && (
                        <td>
                          <span className={`difficulty-tag ${record.difficulty || 'normal'}`}>
                            {record.difficulty === 'hard' ? '困難' : '普通'}
                          </span>
                        </td>
                      )}
                      <td className="time">{formatTime(record.time)}</td>
                      <td>{record.turns}</td>
                      <td className="date">{formatDate(record.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* 分頁控制 */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="page-btn" 
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    ← 上一頁
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    className="page-btn" 
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    下一頁 →
                  </button>
                </div>
              )}

              {/* 頁面資訊 */}
              <div className="page-info">
                {difficultyFilter === 'all' ? (
                  <>顯示 {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} / 共 {filteredRecords.length} 筆記錄</>
                ) : (
                  <>
                    {difficultyFilter === 'normal' ? '普通模式' : '困難模式'} 
                    {' '}第 {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} 名 / 共 {filteredRecords.length} 筆記錄
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}