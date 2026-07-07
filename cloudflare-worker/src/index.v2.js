const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: corsHeaders });

let userProfile = {
  name: "Halal Demo User",
  age: 28,
  gender: "male",
  country: "Iraq",
  governorate: "Sulaymaniyah",
  city: "Sulaymaniyah",
  religion: "islam",
  sect: "sunni",
  ethnicity: "kurdish",
  education: "Bachelor Degree",
  profession: "Professional",
  languages: ["Arabic", "Kurdish", "English"],
  intention: "Seeking serious marriage with privacy and respect.",
  timeline: "Within 1 year",
  wantsChildren: "Yes",
  relocation: "Open to discuss",
  communicationPreference: "Respectful private introduction",
  values: ["Family", "Faith", "Respect"],
  photoPrivacy: "visible",
  privateContactMode: "Private Introduction Requests Only",
  sendRequestsPermission: "Verified members",
  seeProfilePermission: "Verified members",
  email: "demo@halal.app",
  role: "admin",
  badges: ["Verified demo"],
  savedMatches: []
};

let matches = [
  {
    id: "f1",
    name: "Lina",
    age: 26,
    gender: "female",
    governorate: "Sulaymaniyah",
    city: "Sulaymaniyah",
    country: "Iraq",
    religion: "islam",
    sect: "sunni",
    ethnicity: "kurdish",
    profession: "Teacher",
    education: "Bachelor of Education",
    intention: "Serious marriage with family respect.",
    timeline: "Within 6 months",
    wantsChildren: "Yes",
    communicationPreference: "Private respectful correspondence",
    valuesSummary: ["Family First", "Faith", "Respect"],
    verified: true,
    isOnline: true,
    photoStatus: "blurred",
    avatarSeed: "lina",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    compatibilityScore: 94,
    languages: ["Kurdish", "Arabic", "English"],
    aboutMe: "Respectful, family-oriented, and serious.",
    dealbreakers: ["Smoking", "Dishonesty"],
    requestStatus: "none"
  },
  {
    id: "m1",
    name: "Omar",
    age: 31,
    gender: "male",
    governorate: "Erbil",
    city: "Erbil",
    country: "Iraq",
    religion: "islam",
    sect: "sunni",
    ethnicity: "kurdish",
    profession: "Doctor",
    education: "Medical Degree",
    intention: "Stable serious marriage.",
    timeline: "Within 1 year",
    wantsChildren: "Yes",
    communicationPreference: "Family-aware communication",
    valuesSummary: ["Patience", "Family", "Faith"],
    verified: true,
    isOnline: true,
    photoStatus: "visible",
    avatarSeed: "omar",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    compatibilityScore: 91,
    languages: ["Kurdish", "Arabic", "English"],
    aboutMe: "Calm, serious, and family-focused.",
    dealbreakers: ["Irresponsibility"],
    requestStatus: "accepted"
  }
];

let conversations = [
  {
    matchId: "m1",
    messages: [
      {
        id: "welcome_m1",
        sender: "match",
        text: "Assalamu Alaikum. Thank you for connecting with serious intentions.",
        timestamp: "Just now"
      }
    ]
  }
];

let heroImages = [
  {
    id: "hero_1",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    order: 1,
    isActive: true,
    title: "Wedding"
  },
  {
    id: "hero_2",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
    order: 2,
    isActive: true,
    title: "Rings"
  }
];

let communityPosts = [
  {
    id: "post_1",
    category: "advice",
    title: "Respectful family meeting etiquette",
    content: "What are the best respectful steps before family introduction?",
    userName: "HALAL Moderator",
    userGender: "male",
    createdAt: new Date().toISOString(),
    likesCount: 3,
    likedBy: [],
    comments: [],
    isDailyQuestion: true
  }
];

async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    let path = url.pathname;
    if (path.startsWith("/api")) path = path.slice(4);
    if (path === "") path = "/";

    if (path === "/" || path === "/health") {
      return json({
        ok: true,
        app: "HALAL Cloudflare Backend",
        time: new Date().toISOString()
      });
    }

    if (path === "/auth/login" && request.method === "POST") {
      const body = await readJson(request);
      const email = body.email || "demo@halal.app";
      userProfile.email = email;
      userProfile.name = email.split("@")[0] || "Halal User";
      userProfile.role = email.includes("admin") ? "admin" : "user";

      return json({
        token: "cloudflare_demo_token",
        user: {
          id: "me",
          email,
          name: userProfile.name,
          membershipStatus: "free",
          createdAt: new Date().toISOString(),
          role: userProfile.role
        }
      });
    }

    if (path === "/auth/register" && request.method === "POST") {
      const body = await readJson(request);
      userProfile.email = body.email || "demo@halal.app";
      userProfile.name = body.name || "Halal User";
      userProfile.gender = body.gender || "male";
      userProfile.role = userProfile.email.includes("admin") ? "admin" : "user";

      return json({
        token: "cloudflare_demo_token",
        user: {
          id: "me",
          email: userProfile.email,
          name: userProfile.name,
          membershipStatus: "free",
          createdAt: new Date().toISOString(),
          role: userProfile.role
        }
      }, 201);
    }

    if (path === "/auth/forgot-password" && request.method === "POST") {
      return json({
        success: true,
        message: "Demo reset email simulated successfully."
      });
    }

    if (path === "/profile/me" && request.method === "GET") {
      return json(userProfile);
    }

    if (path === "/profile/me" && request.method === "PUT") {
      const body = await readJson(request);
      userProfile = { ...userProfile, ...body };
      return json(userProfile);
    }

    if (path === "/matches" && request.method === "GET") {
      return json({ matches, hasMore: false });
    }

    if (path.startsWith("/matches/") && path.endsWith("/save") && request.method === "POST") {
      const matchId = path.split("/")[2];
      const saved = userProfile.savedMatches || [];
      userProfile.savedMatches = saved.includes(matchId)
        ? saved.filter(id => id !== matchId)
        : [...saved, matchId];
      return json(userProfile);
    }

    if (path === "/requests" && request.method === "POST") {
      const body = await readJson(request);
      const matchId = body.targetMatchId;
      matches = matches.map(m => m.id === matchId ? { ...m, requestStatus: "sent" } : m);
      return json({
        success: true,
        request: {
          id: "req_" + Date.now(),
          senderId: "me",
          receiverId: matchId,
          status: "pending",
          createdAt: new Date().toISOString()
        }
      }, 201);
    }

    if (path.startsWith("/requests/") && path.endsWith("/accept") && request.method === "PUT") {
      const matchId = path.split("/")[2];
      let accepted = null;

      matches = matches.map(m => {
        if (m.id === matchId) {
          accepted = { ...m, requestStatus: "accepted", photoStatus: "unlocked" };
          return accepted;
        }
        return m;
      });

      if (!accepted) return json({ message: "Match not found" }, 404);

      if (!conversations.some(c => c.matchId === matchId)) {
        conversations.push({
          matchId,
          messages: [{
            id: "welcome_" + matchId,
            sender: "match",
            text: "Assalamu Alaikum. Thank you for connecting respectfully.",
            timestamp: "Just now"
          }]
        });
      }

      return json({ success: true, match: accepted });
    }

    if (path === "/conversations" && request.method === "GET") {
      return json(conversations);
    }

    if (path.startsWith("/conversations/") && path.endsWith("/messages") && request.method === "POST") {
      const matchId = path.split("/")[2];
      const body = await readJson(request);
      const msg = {
        id: "msg_" + Date.now(),
        sender: body.sender || "user",
        text: body.text || "",
        timestamp: new Date().toLocaleTimeString()
      };

      let conv = conversations.find(c => c.matchId === matchId);
      if (!conv) {
        conv = { matchId, messages: [] };
        conversations.push(conv);
      }
      conv.messages.push(msg);

      return json(msg, 201);
    }

    if (path === "/hero-images" && request.method === "GET") {
      return json(heroImages.sort((a, b) => a.order - b.order));
    }

    if (path === "/hero-images" && request.method === "POST") {
      const body = await readJson(request);
      const img = {
        id: "hero_" + Date.now(),
        url: body.url,
        title: body.title || "Hero Image",
        isActive: body.isActive !== false,
        order: heroImages.length + 1
      };
      heroImages.push(img);
      return json(img, 201);
    }

    if (path.startsWith("/hero-images/") && request.method === "PUT") {
      const id = path.split("/")[2];
      const body = await readJson(request);
      let updated = null;
      heroImages = heroImages.map(img => {
        if (img.id === id) {
          updated = { ...img, ...body };
          return updated;
        }
        return img;
      });
      return updated ? json(updated) : json({ message: "Not found" }, 404);
    }

    if (path.startsWith("/hero-images/") && request.method === "DELETE") {
      const id = path.split("/")[2];
      heroImages = heroImages.filter(img => img.id !== id).map((img, i) => ({ ...img, order: i + 1 }));
      return json({ success: true });
    }

    if (path === "/hero-images/reorder" && request.method === "PUT") {
      const body = await readJson(request);
      heroImages = Array.isArray(body.reordered) ? body.reordered : heroImages;
      return json(heroImages);
    }

    if (path === "/community/posts" && request.method === "GET") {
      return json(communityPosts);
    }

    if (path === "/community/posts" && request.method === "POST") {
      const body = await readJson(request);
      const post = {
        id: "post_" + Date.now(),
        category: body.category || "advice",
        title: body.title || "New post",
        content: body.content || "",
        userName: userProfile.name || "Member",
        userGender: userProfile.gender || "male",
        createdAt: new Date().toISOString(),
        likesCount: 0,
        likedBy: [],
        comments: [],
        isDailyQuestion: !!body.isDaily
      };
      communityPosts.unshift(post);
      return json(post, 201);
    }

    if (path.match(/^\/community\/posts\/[^/]+\/like$/) && request.method === "POST") {
      const postId = path.split("/")[3];
      let post = communityPosts.find(p => p.id === postId);
      if (!post) return json({ message: "Post not found" }, 404);
      post.likesCount += 1;
      return json(post);
    }

    if (path.match(/^\/community\/posts\/[^/]+\/comments$/) && request.method === "POST") {
      const postId = path.split("/")[3];
      const body = await readJson(request);
      let post = communityPosts.find(p => p.id === postId);
      if (!post) return json({ message: "Post not found" }, 404);
      const comment = {
        id: "comment_" + Date.now(),
        postId,
        userName: body.userName || userProfile.name || "Member",
        userGender: body.userGender || userProfile.gender || "male",
        text: body.text || "",
        createdAt: new Date().toISOString()
      };
      post.comments.push(comment);
      return json(comment, 201);
    }

    if (path.match(/^\/community\/posts\/[^/]+\/report$/) && request.method === "POST") {
      return json({ success: true });
    }

    if (path.match(/^\/community\/posts\/[^/]+\/comments\/[^/]+\/report$/) && request.method === "POST") {
      return json({ success: true });
    }

    if (path.match(/^\/community\/posts\/[^/]+$/) && request.method === "DELETE") {
      const postId = path.split("/")[3];
      communityPosts = communityPosts.filter(p => p.id !== postId);
      return json({ success: true });
    }

    if (path.match(/^\/community\/posts\/[^/]+\/comments\/[^/]+$/) && request.method === "DELETE") {
      const parts = path.split("/");
      const postId = parts[3];
      const commentId = parts[5];
      communityPosts = communityPosts.map(p =>
        p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p
      );
      return json({ success: true });
    }

    return json({ message: "Not found", path }, 404);
  }
};
