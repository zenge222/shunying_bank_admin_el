<template>
  <div>
    <div v-for="(item, index) in qrCodeData" :key="index">
      <vue-qr
        :id_name="'qcode_' + index"
        :text="item.url"
        :callback="getQcodeUrl"
        :bindElement="false"
        :qid="item.qid"
      ></vue-qr>
    </div>
  </div>
</template>

<script>
import JSZip from "jszip";
import FileSaver from "file-saver";
import vueQr from "vue-qr";

export default {
  props: ["qrCodeData", "zipName"],
  components: {
    vueQr,
    JSZip,
    FileSaver,
  },
  data() {
    return {
      qrCodeFile: [],
    };
  },
  methods: {
    getQcodeUrl(url, name) {
      var that = this;
      this.qrCodeFile.push({
        url: url,
        name: name,
      });
      if (this.qrCodeFile.length == this.qrCodeData.length) {
        const zip = new JSZip();
        this.qrCodeFile.forEach((item) => {
          const fileName = item.name + ".png";
          zip.file(fileName, item.url.substring(22), { base64: true }); //向zip中添加文件
        });
        zip.generateAsync({ type: "blob" }).then((content) => {
          // 生成二进制流
          FileSaver.saveAs(content, that.zipName + "设备二维码.zip"); // 利用file-saver保存文件
        });
        this.$emit("closeDownload");
        this.qrCodeFile = [];
      }
    },
  },
};
</script>