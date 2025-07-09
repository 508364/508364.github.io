<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Minecraft服务器状态监测平台</h1>
        <p>实时监控您喜爱的Minecraft服务器状态、延迟和玩家数量</p>
        <button @click="showForm = true" class="cta-button">
          <i class="fas fa-plus"></i> 添加服务器
        </button>
      </div>
    </div>
    
    <div class="features-section">
      <div class="feature">
        <i class="fas fa-bolt"></i>
        <h3>实时监控</h3>
        <p>即时获取服务器在线状态和延迟信息</p>
      </div>
      <div class="feature">
        <i class="fas fa-users"></i>
        <h3>玩家统计</h3>
        <p>查看服务器当前玩家数量和版本信息</p>
      </div>
      <div class="feature">
        <i class="fas fa-sync"></i>
        <h3>自动刷新</h3>
        <p>定期更新服务器状态，保持信息最新</p>
      </div>
    </div>
    
    <div class="popular-servers">
      <h2>热门Minecraft服务器</h2>
      <div class="server-grid">
        <div class="popular-server">
          <h3>Hypixel</h3>
          <p>mc.hypixel.net</p>
          <button @click="addPopularServer('Hypixel', 'mc.hypixel.net')">添加</button>
        </div>
        <div class="popular-server">
          <h3>2b2t</h3>
          <p>2b2t.org</p>
          <button @click="addPopularServer('2b2t', '2b2t.org')">添加</button>
        </div>
        <div class="popular-server">
          <h3>Mineplex</h3>
          <p>us.mineplex.com</p>
          <button @click="addPopularServer('Mineplex', 'us.mineplex.com')">添加</button>
        </div>
        <div class="popular-server">
          <h3>CubeCraft</h3>
          <p>play.cubecraft.net</p>
          <button @click="addPopularServer('CubeCraft', 'play.cubecraft.net')">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['showForm'],
  methods: {
    addPopularServer(name, address) {
      this.$emit('add-server', {
        name: name,
        address: address,
        port: 25565
      });
    }
  }
};
</script>

<style scoped>
.home {
  padding: 0;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  padding: 2rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: var(--success-color);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.features-section {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 2rem;
  background-color: var(--bg-color);
}

.feature {
  text-align: center;
  max-width: 300px;
}

.feature i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.popular-servers {
  padding: 3rem 2rem;
  background-color: var(--card-bg);
  text-align: center;
}

.popular-servers h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.popular-server-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.popular-server {
  background-color: var(--bg-color);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.popular-server h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.popular-server p {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.popular-server button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .features-section {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.2rem;
  }
}
</style>