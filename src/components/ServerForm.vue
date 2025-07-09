<template>
  <div class="server-form">
    <div class="form-header">
      <h3>添加新服务器</h3>
      <button @click="close" class="close-btn" title="关闭">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="form-body">
      <div class="form-group">
        <label for="serverName">服务器名称</label>
        <input 
          type="text" 
          id="serverName" 
          v-model="server.name" 
          placeholder="例如: Hypixel"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="serverAddress">服务器地址</label>
        <input 
          type="text" 
          id="serverAddress" 
          v-model="server.address" 
          placeholder="例如: mc.hypixel.net"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="serverPort">服务器端口</label>
        <input 
          type="number" 
          id="serverPort" 
          v-model="server.port" 
          placeholder="默认: 25565"
          min="1"
          max="65535"
        >
      </div>
    </div>
    
    <div class="form-footer">
      <button @click="close" class="cancel-btn">取消</button>
      <button @click="addServer" class="add-btn">添加服务器</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      server: {
        name: '',
        address: '',
        port: 25565
      }
    };
  },
  methods: {
    addServer() {
      if (!this.server.name.trim() || !this.server.address.trim()) {
        alert('请填写服务器名称和地址');
        return;
      }
      
      this.$emit('add-server', { ...this.server });
      this.resetForm();
    },
    close() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.server = {
        name: '',
        address: '',
        port: 25565
      };
    }
  }
};
</script>