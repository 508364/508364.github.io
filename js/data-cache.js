/**
 * 数据缓存工具类
 * 用于缓存GitHub API响应，减少请求次数
 */
class DataCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存时间
  }

  /**
   * 设置缓存
   * @param {string} key 缓存键
   * @param {any} data 要缓存的数据
   */
  set(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  /**
   * 获取缓存
   * @param {string} key 缓存键
   * @returns {any|null} 缓存数据或null
   */
  get(key) {
    if (!this.cache.has(key)) return null;
    
    const cacheItem = this.cache.get(key);
    const now = Date.now();
    
    if (now - cacheItem.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cacheItem.data;
  }

  /**
   * 清除所有缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 清除过期缓存
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, cacheItem] of this.cache.entries()) {
      if (now - cacheItem.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }
}

// 导出实例
const dataCache = new DataCache();
export default dataCache;
