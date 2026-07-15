import { onRequestGet as __api_marriage_cafe_images__key__ts_onRequestGet } from "C:\\Users\\HB LAPTOP STORE\\CascadeProjects\\halal\\functions\\api\\marriage-cafe\\images\\[key].ts"
import { onRequestDelete as __api_marriage_cafe_posts__id__ts_onRequestDelete } from "C:\\Users\\HB LAPTOP STORE\\CascadeProjects\\halal\\functions\\api\\marriage-cafe\\posts\\[id].ts"
import { onRequestPut as __api_marriage_cafe_posts__id__ts_onRequestPut } from "C:\\Users\\HB LAPTOP STORE\\CascadeProjects\\halal\\functions\\api\\marriage-cafe\\posts\\[id].ts"
import { onRequestGet as __api_marriage_cafe_posts_ts_onRequestGet } from "C:\\Users\\HB LAPTOP STORE\\CascadeProjects\\halal\\functions\\api\\marriage-cafe\\posts.ts"
import { onRequestPost as __api_marriage_cafe_posts_ts_onRequestPost } from "C:\\Users\\HB LAPTOP STORE\\CascadeProjects\\halal\\functions\\api\\marriage-cafe\\posts.ts"

export const routes = [
    {
      routePath: "/api/marriage-cafe/images/:key",
      mountPath: "/api/marriage-cafe/images",
      method: "GET",
      middlewares: [],
      modules: [__api_marriage_cafe_images__key__ts_onRequestGet],
    },
  {
      routePath: "/api/marriage-cafe/posts/:id",
      mountPath: "/api/marriage-cafe/posts",
      method: "DELETE",
      middlewares: [],
      modules: [__api_marriage_cafe_posts__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/marriage-cafe/posts/:id",
      mountPath: "/api/marriage-cafe/posts",
      method: "PUT",
      middlewares: [],
      modules: [__api_marriage_cafe_posts__id__ts_onRequestPut],
    },
  {
      routePath: "/api/marriage-cafe/posts",
      mountPath: "/api/marriage-cafe",
      method: "GET",
      middlewares: [],
      modules: [__api_marriage_cafe_posts_ts_onRequestGet],
    },
  {
      routePath: "/api/marriage-cafe/posts",
      mountPath: "/api/marriage-cafe",
      method: "POST",
      middlewares: [],
      modules: [__api_marriage_cafe_posts_ts_onRequestPost],
    },
  ]