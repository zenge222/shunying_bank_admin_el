<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <!-- <i class="el-icon-caret-bottom" /> -->
          <div class="left_top">
            <!-- @/assets/menu_logo.png -->
            <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
            <img :src="userData.profile" class="user-avatar" />
            <div class="top_info">
              <p v-text="userData.nickName"></p>
              <!-- <p>技术部</p> -->
            </div>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              <span style="padding-left: 10px">修改密码</span>
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="padding-left: 10px">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  data() {
    return {
      userData: {
        username: "",
        profile: "",
        nickName: "",
      },
    };
  },
  mounted() {
    this.userData = JSON.parse(localStorage.getItem("userInfo"));
  },
  methods: {},
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      await this.$store.dispatch("permission/clearRoles");
      // localStorage.setItem("showMenu", false);
      localStorage.clear();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.left_top {
  display: flex;
  align-items: center;
  .top_info {
    margin-left: 10px;
    p {
      margin: 0;
      line-height: 1;
    }
    p:last-child {
      margin-top: 4px;
    }
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
