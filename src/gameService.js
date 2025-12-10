// gameService.js
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';

// 儲存遊戲記錄
export const saveGameRecord = async (userId, email, turns, timeInSeconds, difficulty = 'normal') => {
  try {
    const gameRecord = {
      userId,
      email,
      turns,
      time: timeInSeconds,
      difficulty,
      completedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'gameRecords'), gameRecord);
    console.log('遊戲記錄已儲存:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {  // ← 修正: err 改成 error
    console.error('儲存遊戲記錄失敗:', error);
    return { success: false, error: error.message };
  }
};

// 獲取個人最佳記錄(增加到 100 筆,前端分頁)
export const getPersonalBestRecords = async (userId) => {
  try {
    const q = query(
      collection(db, 'gameRecords'),
      where('userId', '==', userId),
      orderBy('time', 'asc'),
      orderBy('completedAt', 'desc'),
      limit(100)  // ← 改成 100 筆
    );

    const querySnapshot = await getDocs(q);
    const records = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        completedAt: data.completedAt.toDate()
      });
    });

    return records;
  } catch (error) {
    console.error('獲取個人記錄失敗:', error);
    return [];
  }
};

// 獲取全球排行榜(前 10 名)
export const getGlobalLeaderboard = async () => {
  try {
    const q = query(
      collection(db, 'gameRecords'),
      orderBy('time', 'asc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const records = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        ...data,
        completedAt: data.completedAt.toDate()
      });
    });

    return records;
  } catch (error) {
    console.error('獲取排行榜失敗:', error);
    return [];
  }
};