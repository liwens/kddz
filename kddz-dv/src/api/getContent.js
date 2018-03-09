import {vue}from '../main'
import {url_getList, url_getDetail} from "./url";


/**
  获取列表，用于第一次进入
*/
export function getList(params) {
  return vue.$axios.get(url_getList,{params}).then((res)=> {
      return Promise.resolve(res.data);
    }).catch((e) => {
      return Promise.reject(e)
    });
}

/**
获取下一条
*/
export function getNext(params) {
  return vue.$axios.get(url_getDetail,{params}).then((res)=> {
    return Promise.resolve(res.data)
  }).catch((e) => {
    return Promise.reject(e)
  })
}
