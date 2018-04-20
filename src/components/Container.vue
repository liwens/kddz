<template>
<section id="container">
  <div class="head">
    <img :src="data.userAvatar" alt="头像">
    <div class="userName">{{data.userName}}</div>
  </div>
  <article>
    <p v-if="data.topicContent">{{data.topicContent}}</p>
    <p v-if="data.topicPic && !isPlay && !data.topicVedio">
      <img v-lazy="data.topicPic" alt="">
    </p>
    <!--视频-->
    <p v-if="data.topicVedio" class="videoContainer">
      <video :src="data.topicVedio" preload="auto" @play="onPlay" controls></video>
    </p>

  </article>
  <!--互动按钮-->
  <section class="interaction">
    <div @click="dig">
      <svg class="icon" aria-hidden="true" ref="svgDig" :class="{animateNod: isDig}">
            <use xlink:href="#icon-emoji-"></use>
          </svg>
      <span class="count" ref="digCount" :class="{animateCount: isDig}">
          {{data.diggCount}}
          </span>
    </div>
    <div @click="bury">
      <svg class="icon" aria-hidden="true" ref="svgBury" :class="{animateShake: isBury}">
          <use xlink:href="#icon-emoji-1"></use>
        </svg>
      <span class="count" ref="buryCount" :class="{animateCount: isBury}">{{data.buryCount}}</span>
    </div>
  </section>

  <!--下一条-->
  <section class="bottom" @click='next'>
    <div class="next">>></div>
  </section>

  <!-- 加载动画 -->
  <div class='loading' v-if='isLoading'>
    <vue-loading type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
  </div>

  <!--ad @1-->
  <!--<div id="ws-zl-dybanner263"></div>-->
</section>
</template>

<script>
import { getList, getNext } from '../api/getContent'
export default {
  name: "container",
  components: {
    vueLoading: () =>
      import ('vue-loading-template')
  },
  data() {
    return {
      num: Math.floor(Math.random() * 100000), //随机数
      pageSize: 1, //列表，每次加载数据数量
      data: '', //数据
      isDig: false, //判断有没有点赞
      isBury: false, //判断有没有踩过
      isIntered: false, //判断有没有点赞/踩
      nextId: 0, //下一条的id
      isLoading: false, //数据是否请求中
      isPlay: false
    }
  },
  watch: {
    /**
     * 点击下一条时，将id赋值给hash。
     * */
    // nextId: function(newvalue, oldvalue) {
    //   window.location.hash = newvalue + 1;
    // }
  },
  mounted() {
    /**
     * 判断是否有hash，如果有则请求hash中的id
     * */
    if (window.location.hash) {
      this.$nextTick(() => {
        this.hasHash()
      })
    } else {
      this.$nextTick(() => {
        this._getList();
      })
    }

  },
  methods: {
    //ad @2
    //  appendAd() {
    //    let adDom = document.createElement('aside');
    //    adDom.id = 'ws-zl-dybanner263'
    //    document.getElementById('container').appendChild(adDom);
    //    let adjs = document.createElement('script');
    //    adjs.src = 'http://nads.wuaiso.com/newswap/wap/js/asyunion.js';
    //    adjs.id = 'ad';
    //
    //    //移除上一个广告js
    //    this.removead();
    //    document.body.appendChild(adjs);
    //
    //  },

    /**
     * 移除页面多余的adjs ad@3
     * */
    //  removead() {
    //    let adjs = document.getElementById('ad');
    //
    //    if (adjs) {
    //      adjs.parentNode.removeChild(adjs);
    //    }
    //    let adDom = document.getElementById('ws-zl-dybanner263');
    //    if (adDom) {
    //      adDom.parentNode.removeChild(adDom);
    //    }
    //  },

    /**
     * 播放视频时，隐藏预览图片
     * */
    onPlay() {
      this.isPlay = true;
    },

    /**
     * 获取数据，再mounted处调用
     * */
    _getList() {
      let parmes = {
        pageNum: this.num,
        pageSize: this.pageSize
      };
      getList(parmes).then((res) => {
        this.data = res.returnValue.list[0];
        this.nextId = res.returnValue.prePage;
      })
    },

    /**
     * 点赞喜欢的逻辑
     * */
    dig() {
      if (this.isIntered) return
      this.isDig = true;
      this.data.diggCount = this.data.diggCount + 1;
      this.isIntered = true
    },

    /**
     * 不喜欢的逻辑
     * */
    bury() {
      if (this.isIntered) return;

      this.isBury = true;
      this.data.buryCount = this.data.buryCount + 1;

      this.isIntered = true
    },

    /**
     * 有hash时请求的逻辑。
     * */
    hasHash() {
      let params = {
        id: window.location.hash.replace("#", "")
      };
      getNext(params).then((res) => {
        this.data = res.returnValue;
        this.nextId = res.returnValue.id;
        // window.location.hash = res.returnValue.id;

        this.isDig = false; //判断有没有点赞
        this.isBury = false; //判断有没有踩过
        this.isIntered = false; //判断是否互动过
        this.isLoading = false; //隐藏加载动画
        this.isPlay = false; //视频播放时，隐藏预览图

        //      this.appendAd(); //添加广告 ad@4

        this.setScrollTop(); //恢复滚动条位置
      })
    },
    /**
      下一条，加载数据
    */
    next() {
      if (this.isLoading) return;

      let params = {
        id: this.nextId
      }

      this.isLoading = true;
      getNext(params).then((res) => {
        this.data = res.returnValue;
        this.nextId = res.returnValue.id;
        window.location.hash = res.returnValue.id;

        this.isDig = false; //判断有没有点赞
        this.isBury = false; //判断有没有踩过
        this.isIntered = false; //判断是否互动过
        this.isLoading = false; //隐藏加载动画
        this.isPlay = false; //视频播放时，隐藏预览图

        //         this.appendAd();      // 添加广告ad @5

        this.setScrollTop(); //恢复滚动条位置
        // location.reload();
      })
    },
    /**
     * 恢复滚动条顶置位置,
     * */
    setScrollTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

  },

}
</script>

<style lang="css">

  @reset-global mobile;
  body{
    font-size: 16px;
    line-height: 30px;


  }
  #container{
    padding: 10px;
    box-shadow:0 15px 10px -10px rgba(0,0,0,.22) inset;
    /* 头部 */
    .head{
      display: flex;
      align-items: center;
      img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .userName{
        padding-left: 10px;
        font-size: 14px;
      }
    }

    /* 内容 */
    article{
      margin: 10px 5px;
      p{
        padding: 5px 0;
        img{
          width: 100%;
        }
        video{
          width: 100%;
        }
      }
    }

    /* 互动 */
    .interaction{
      display: flex;
      justify-content: center;
      div{
        text-align: center;
        /*border: 1px solid red;*/
        width: 40%;
        svg{
          cursor: pointer;
          font-size: 40px;
          transition: all .3s;
        }
        .animateShake{
          animation: shake 0.4s;
        }
        .animateNod{
          animation: nod 0.6s;
        }
        .animateCount{
          color: rgb(219,62,62);
          &:after{
             animation: countAdd .6s;
           }
        }
        .count{
          font-family: fantasy;
           position: relative;
           &:after{
              position: absolute;
              content: "+1";
              left: 10px;
              top: 0;
              opacity: 0;
              transition: all .8s;
           }
        }
      }
    }

    /* 底部,下一条 */
    /*.bottom{
      position: fixed * 4% 4% *;
      width: 60px;
      height: 60px;
      color: #fff;
      border-radius: 50%;
      line-height: 40px;
      text-align: center;
      background-color: #000000;
      opacity: 0.6;
      cursor: pointer;
      user-select: none;
      transition: all .4s;
      &::active{
				background-color: red;
      }
      &:active{
        box-shadow: 0 0 25px 0px rgba(0,0,0,0.22) inset;
        &:after{
           width: 50px;
         }
       }
      .next{
      	line-height: 60px;
        position: relative;
      }
    }*/
   .bottom{
   	right: 4%;
   	bottom: 4%;
   	position: fixed;
   	width: 40px;
   	height: 40px;
   	color: #fff;
   	border-radius: 50%;
   	line-height: 10px;
		text-align: center;
   	background-color: #000;
   	opacity: .2;
   	cursor:pointer;
   	user-select: none;
   	transition: all .3s;
   	&:active {
   		/*text-align: right;*/
   		opacity: .4;
   	}
   	.next {
   		line-height: 40px;
   		position: relative;
   	}
   }
   /* 广告样式 ad@6 */
    /*#ws-zl-dybanner263{
      margin-bottom: 40px;
    }*/
  }
  /*container 结束*/

  .loading{
    position: absolute 50% * * 50%;
    transform: translate(-50%, -50%);
  }
  /* 头像摇动动画 */
  @keyframes shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: rotate(20deg);
    }
    40%{
      transform: rotate(-20deg);
    }
    60%{
      transform:  rotate(10deg);
    }
    80% {
      transform:  rotate(-10deg);
    }
    100%{
      transform: rotate(0deg);
    }
  }
  /* 点头 */
  @keyframes nod {
    0% {
      transform:translateY(0px);
    }
    20%{
      transform:  translateY(-5px);
    }
    40%{
      transform:  translateY(5px);
    }
    60%{
      transform:  translateY(-3px);
    }
    80% {
      transform:  translateY(3px);
    }
    100%{
      transform: translateY(0px);
    }
  }

  /* count增加动画 */
  @keyframes countAdd {
    0% {
      top: 0;
      opacity: 0.2;
    }
    25%{
      top: -8px
    }
    50%{
      top: -16px;
      opacity: 1;
    }
    75%{
      top: -24px;
      opacity: .3;
    }
    100% {
      top: -32px;
      opacity: 0;
    }
  }
</style>
