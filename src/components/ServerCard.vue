<template>
  <div class="server-card" :class="{ offline: !server.online }">
    <div class="server-header">
      <div class="status-indicator" :class="{ online: server.online }"></div>
      <h3>{{ server.name }}</h3>
      <button @click="$emit('remove')" class="delete-btn" title="移除服务器">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    
    <div class="server-info">
      <div class="server-address">
        <i class="fas fa-server"></i>
        <span>{{ server.address }}:{{ server.port }}</span>
      </div>
      
      <div v-if="server.online" class="server-stats">
        <div class="stat">
          <i class="fas fa-signal"></i>
          <span>延迟: {{ server.ping }}ms</span>
        </div>
        <div class="stat">
          <i class="fas fa-users"></i>
          <span>玩家: {{ server.players }}</span>
        </div>
        <div class="stat">
          <i class="fas fa-code-branch"></i>
          <span>版本: {{ server.version }}</span>
        </div>
      </div>
      <div v-else class="offline-message">
        <i class="fas fa-exclamation-triangle"></i>
        <span>服务器离线或无法连接</span>
      </div>
    </div>
    
    <div class="server-footer">
      <small>最后检查: {{ server.lastChecked || '未检查' }}</small>
      <button @click="$emit('refresh')" class="refresh-btn" :disabled="isRefreshing" title="刷新状态">
        <i class="fas fa-sync" :class="{spin: isRefreshing}"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    server: Object
  },
  data() {
    return {
      isRefreshing: false
    };
  },
  methods: {
    async refreshServer() {
      if (this.isRefreshing) return;
      
      this.isRefreshing = true;
      await this.$emit('refresh');
      this.isRefreshing = false;
    }
  }
};
</script>