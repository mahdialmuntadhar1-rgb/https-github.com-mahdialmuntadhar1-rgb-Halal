var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/marriage-cafe/images/[key].ts
var onRequestGet = /* @__PURE__ */ __name(async ({ params, env }) => {
  const rawKey = String(params.key || "");
  const key = decodeURIComponent(rawKey);
  if (!key || !key.startsWith("marriage-cafe-")) {
    return new Response("Invalid image key", { status: 400 });
  }
  const object = await env.ZAWAJ_UPLOADS.get(key);
  if (!object) {
    return new Response("Image not found", { status: 404 });
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000");
  return new Response(object.body, { headers });
}, "onRequestGet");

// api/marriage-cafe/posts/[id].ts
var POSTS_KEY = "marriage-cafe-posts.json";
var jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders
  });
}
__name(json, "json");
async function readPosts(env) {
  const object = await env.ZAWAJ_UPLOADS.get(POSTS_KEY);
  if (!object) return [];
  try {
    const text = await object.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
__name(readPosts, "readPosts");
async function writePosts(env, posts) {
  await env.ZAWAJ_UPLOADS.put(POSTS_KEY, JSON.stringify(posts, null, 2), {
    httpMetadata: {
      contentType: "application/json; charset=utf-8"
    }
  });
}
__name(writePosts, "writePosts");
function dataUrlToBytes(dataUrl) {
  const match2 = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match2) {
    throw new Error("Invalid image data.");
  }
  const contentType = match2[1] || "image/jpeg";
  const base64 = match2[2];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return { bytes, contentType };
}
__name(dataUrlToBytes, "dataUrlToBytes");
function getPostId(params) {
  const raw = params.id;
  return Array.isArray(raw) ? raw[0] : String(raw || "");
}
__name(getPostId, "getPostId");
var onRequestPut = /* @__PURE__ */ __name(async ({ request, params, env }) => {
  try {
    const id = getPostId(params);
    if (!id) {
      return json({ success: false, message: "Post id is required." }, 400);
    }
    const body = await request.json();
    const posts = await readPosts(env);
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) {
      return json({ success: false, message: "Post not found." }, 404);
    }
    const current = posts[index];
    const updated = {
      ...current,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (typeof body.caption === "string") {
      updated.caption = body.caption.trim() || current.caption;
    }
    if (typeof body.likes === "number" && Number.isFinite(body.likes)) {
      updated.likes = Math.max(0, Math.round(body.likes));
    }
    const imageDataUrl = String(body.imageDataUrl || "").trim();
    if (imageDataUrl) {
      const { bytes, contentType } = dataUrlToBytes(imageDataUrl);
      const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
      const imageKey = `marriage-cafe-${id}-edited-${Date.now()}.${extension}`;
      await env.ZAWAJ_UPLOADS.put(imageKey, bytes, {
        httpMetadata: {
          contentType,
          cacheControl: "public, max-age=31536000"
        }
      });
      updated.imageKey = imageKey;
      updated.imageUrl = `/api/marriage-cafe/images/${encodeURIComponent(imageKey)}`;
    }
    posts[index] = updated;
    await writePosts(env, posts);
    return json({ success: true, post: updated });
  } catch (error) {
    return json({
      success: false,
      message: error?.message || "Could not update Marriage Cafe post."
    }, 500);
  }
}, "onRequestPut");
var onRequestDelete = /* @__PURE__ */ __name(async ({ params, env }) => {
  try {
    const id = getPostId(params);
    if (!id) {
      return json({ success: false, message: "Post id is required." }, 400);
    }
    const posts = await readPosts(env);
    const updatedPosts = posts.filter((post) => post.id !== id);
    if (updatedPosts.length === posts.length) {
      return json({ success: false, message: "Post not found." }, 404);
    }
    await writePosts(env, updatedPosts);
    return json({ success: true });
  } catch (error) {
    return json({
      success: false,
      message: error?.message || "Could not delete Marriage Cafe post."
    }, 500);
  }
}, "onRequestDelete");

// api/marriage-cafe/posts.ts
var POSTS_KEY2 = "marriage-cafe-posts.json";
var jsonHeaders2 = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
function json2(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders2
  });
}
__name(json2, "json");
async function readPosts2(env) {
  const object = await env.ZAWAJ_UPLOADS.get(POSTS_KEY2);
  if (!object) return [];
  try {
    const text = await object.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
__name(readPosts2, "readPosts");
async function writePosts2(env, posts) {
  await env.ZAWAJ_UPLOADS.put(POSTS_KEY2, JSON.stringify(posts, null, 2), {
    httpMetadata: {
      contentType: "application/json; charset=utf-8"
    }
  });
}
__name(writePosts2, "writePosts");
function dataUrlToBytes2(dataUrl) {
  const match2 = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match2) {
    throw new Error("Invalid image data.");
  }
  const contentType = match2[1] || "image/jpeg";
  const base64 = match2[2];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return { bytes, contentType };
}
__name(dataUrlToBytes2, "dataUrlToBytes");
var onRequestGet2 = /* @__PURE__ */ __name(async ({ env }) => {
  const posts = await readPosts2(env);
  return json2({ success: true, posts });
}, "onRequestGet");
var onRequestPost = /* @__PURE__ */ __name(async ({ request, env }) => {
  try {
    const body = await request.json();
    const caption = String(body.caption || "").trim();
    const imageDataUrl = String(body.imageDataUrl || "").trim();
    if (!caption && !imageDataUrl) {
      return json2({ success: false, message: "Caption or image is required." }, 400);
    }
    if (!imageDataUrl) {
      return json2({ success: false, message: "Image is required for Marriage Cafe posts." }, 400);
    }
    const now = /* @__PURE__ */ new Date();
    const id = `cafe_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
    const { bytes, contentType } = dataUrlToBytes2(imageDataUrl);
    const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const imageKey = `marriage-cafe-${id}.${extension}`;
    await env.ZAWAJ_UPLOADS.put(imageKey, bytes, {
      httpMetadata: {
        contentType,
        cacheControl: "public, max-age=31536000"
      }
    });
    const post = {
      id,
      author: body.author || "Zawaj Al Araqi Member",
      role: "Member post",
      avatar: body.avatar || "\u0632",
      time: "Just now",
      imageUrl: `/api/marriage-cafe/images/${encodeURIComponent(imageKey)}`,
      imageKey,
      caption: caption || "A respectful visual post shared with the community.",
      likes: 0,
      comments: [],
      createdAt: now.toISOString()
    };
    const posts = await readPosts2(env);
    const updatedPosts = [post, ...posts].slice(0, 200);
    await writePosts2(env, updatedPosts);
    return json2({ success: true, post });
  } catch (error) {
    return json2({
      success: false,
      message: error?.message || "Could not save Marriage Cafe post."
    }, 500);
  }
}, "onRequestPost");

// ../.wrangler/tmp/pages-PQ1deQ/functionsRoutes-0.46837321066320337.mjs
var routes = [
  {
    routePath: "/api/marriage-cafe/images/:key",
    mountPath: "/api/marriage-cafe/images",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/marriage-cafe/posts/:id",
    mountPath: "/api/marriage-cafe/posts",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/marriage-cafe/posts/:id",
    mountPath: "/api/marriage-cafe/posts",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/marriage-cafe/posts",
    mountPath: "/api/marriage-cafe",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/marriage-cafe/posts",
    mountPath: "/api/marriage-cafe",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  }
];

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
