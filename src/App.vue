<template>
  <div class="app" :class="theme">
    <header class="app-header">
      <div class="logo">
        <img src="./assets/mc-icons.png" alt="Minecraft Icon">
        <h1>Minecraft服务器状态监测平台</h1>
      </div>
      <div class="controls">
        <button @click="showForm = !showForm" class="add-btn">
          <i class="fas fa-plus"></i> 添加服务器
        </button>
        <button @click="refreshAll" class="refresh-btn" :disabled="refreshing">
          <i class="fas fa-sync" :class="{spin: refreshing}"></i> 刷新状态
        </button>
        <div class="theme-toggle">
          <span>深色模式: </span>
          <label class="switch">
            <input type="checkbox" v-model="darkTheme">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </header>

    <main class="app-content">
      <ServerForm v-if="showForm" @add-server="addServer" @close="showForm = false" />
      
      <div v-if="loading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> 正在加载服务器信息...
      </div>
      
      <div v-if="servers.length === 0 && !loading" class="empty-state">
        <i class="fas fa-server"></i>
        <h3>没有添加任何服务器</h3>
        <p>点击上方"添加服务器"按钮开始监控</p>
      </div>
      
      <div class="server-grid">
        <ServerCard 
          v-for="(server, index) in servers" 
          :key="server.id"
          :server="server"
          @remove="removeServer(index)"
          @refresh="refreshServer(index)"
        />
      </div>
    </main>

    <footer class="app-footer">
      <p>© 2023 Minecraft服务器监测平台 | 508364.GitHub.io</p>
      <p>状态更新时间: {{ lastUpdate }}</p>
    </footer>
  </div>
</template>

<script>
import ServerCard from './components/ServerCard.vue';
import ServerForm from './components/ServerForm.vue';

export default {
  components: {
    ServerCard,
    ServerForm
  },
  data() {
    return {
      showForm: false,
      loading: true,
      refreshing: false,
      darkTheme: false,
      lastUpdate: '',
      servers: [
        {
          id: 1,
          name: 'Hypixel',
          address: 'mc.hypixel.net',
          port: 25565,
          online: false,
          ping: null,
          players: '0/0',
          version: '未知',
          lastChecked: null,
          createdByUser: false
        },
        {
          id: 2,
          name: '2b2t',
          address: '2b2t.org',
          port: 25565,
          online: false,
          ping: null,
          players: '0/0',
          version: '未知',
          lastChecked: null,
          createdByUser: false
        },
        {
          id: 3,
          name: 'Mineplex',
          address: 'us.mineplex.com',
          port: 25565,
          online: false,
          ping: null,
          players: '0/0',
          version: '未知',
          lastChecked: null,
          createdByUser: false
        },
        {
          id: 4,
          name: 'CubeCraft',
          address: 'play.cubecraft.net',
          port: 25565,
          online: false,
          ping: null,
          players: '0/0',
          version: '未知',
          lastChecked: null,
          createdByUser: false
        }
      ]
    };
  },
  computed: {
    theme() {
      return this.darkTheme ? 'dark-theme' : 'light-theme';
    }
  },
  mounted() {
    this.refreshAll();
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.lastUpdate = now.toLocaleTimeString();
    },
    async refreshAll() {
      this.refreshing = true;
      const promises = this.servers.map((server, index) => this.refreshServer(index));
      await Promise.all(promises);
      this.refreshing = false;
    },
    async refreshServer(index) {
      const server = this.servers[index];
      server.lastChecked = new Date().toLocaleString();
      
      try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${server.address}:${server.port || 25565}`);
        const data = await response.json();
        
        if (data.online) {
          server.online = true;
          server.ping = data.ping;
          server.players = `${data.players.online}/${data.players.max}`;
          server.version = data.version;
        } else {
          server.online = false;
          server.ping = null;
        }
      } catch (error) {
        console.error(`检查服务器状态时出错: ${server.name}`, error);
        server.online = false;
        server.ping = null;
      }
      
      // 如果是用户添加的服务器，且无法连接，则标记为移除
      if (server.createdByUser && !server.online) {
        this.$nextTick(() => {
          setTimeout(() => {
            if (!server.online) {
              this.removeServer(index);
            }
          }, 5000);
        });
      }
    },
    addServer(newServer) {
      const server = {
        id: Date.now(),
        name: newServer.name,
        address: newServer.address,
        port: newServer.port || 25565,
        online: false,
        ping: null,
        players: '0/0',
        version: '未知',
        lastChecked: null,
        createdByUser: true
      };
      
      this.servers.unshift(server);
      this.refreshServer(0); // 刷新刚添加的服务器
      this.showForm = false;
    },
    removeServer(index) {
      this.servers.splice(index, 1);
    }
  }
};
</script>