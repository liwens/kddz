<template>
  <section id="conatiner">
    <div class="head">
      <img :src="data.userAvatar" alt="头像">
      <div class="userName">{{data.userName}}</div>
    </div>
    <article>
      <p v-if="data.topicContent">{{data.topicContent}}</p>
      <p v-if="data.topicPic"><img :src="data.topicPic" alt=""></p>
      <p v-if="data.topicVedio">
        <vedio :src="data.topicVedio"></vedio>
      </p>
    </article>
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
        <span class="count" ref="buryCount"  :class="{animateCount: isBury}">{{data.buryCount}}</span>
      </div>
    </section>
    <section class="bottom">
      <div class="next" @click='next'>下一条</div>
    </section>

    <!-- 加载动画 -->
    <div class='loading' v-if='isLoading'>
      <vue-loading type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
   </div>
  </section>
</template>

<script>
  import { getList, getNext } from '../api/getContent'
    export default {
      name: "container",
      components: {
        vueLoading:  () => import('vue-loading-template')
      },
      data() {
        return {
          num: Math.floor(Math.random() * 80000),      //随机数
          pageSize: 1,      //列表，每次加载数据数量
          data: '',         //数据
          isDig: false,    //判断有没有点赞
          isBury: false,    //判断有没有踩过
          isIntered: false,  //判断有没有点赞/踩
          nextId: 0,        //下一条的id
          isLoading: false    //数据是否请求中
        }
      },
      mounted() {
        /**
         * 请求数据
         * */
        this.$nextTick(()=> {
          this._getList();
        })
      },
      methods: {
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
            this.nextId = res.returnValue.prePage
          })
        },

        /**
         * 点赞喜欢的逻辑
         * */
        dig() {
          if(this.isIntered) return
          this.isDig = true;
          this.data.diggCount =  this.data.diggCount + 1;
          this.isIntered = true
        },

        /**
         * 不喜欢的逻辑
         * */
        bury() {
          if(this.isIntered) return;

          this.isBury = true;
          this.data.buryCount =  this.data.buryCount+1;

          this.isIntered = true
        },

        /**
          下一条，加载数据
        */
        next() {
          if(this.isLoading) return;

          let params = {
            id: this.nextId
          }

          this.isLoading = true;
          getNext(params).then((res)=> {
            this.data = res.returnValue;
            this.nextId =  res.returnValue.id;

            this.isDig =  false;    //判断有没有点赞
            this.isBury =  false;    //判断有没有踩过
            this.isIntered = false;
            this.isLoading = false;  //隐藏加载动画
          })
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
  #conatiner{
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
    .bottom{
      position: fixed * * 0 0;
      border-top: 1px solid #eee;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #fff;
      cursor: pointer;
      user-select: none;
      transition: all .4s;

      &::hover{
        background-color: #eee;
      }

      .next{

      }
    }


  }
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
