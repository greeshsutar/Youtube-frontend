# Frontend TODO (YouTube Clone - React Vite)

- [ ] Create Vite + React project structure in `frontend/` (index.html, vite config, src/*)
- [ ] Add core dependencies (react-router-dom, axios, tailwind) and set up Tailwind (or simple CSS fallback)
- [ ] Implement `src/api/axios.js` with baseURL http://localhost:5000 and auth header injection
- [ ] Implement `src/context/AuthContext.jsx` (register/login/logout, token in localStorage, hydrate on load)
- [ ] Implement protected route wrapper for authenticated-only pages
- [ ] Implement shared UI components: Navbar, Sidebar, VideoCard, Loader, Comment
- [ ] Implement pages: Register, Login, Home, VideoPage, Upload (protected), Channel (protected)
- [ ] Home: fetch GET /api/videos and render grid + search/filter by title
- [ ] VideoPage: fetch GET /api/videos/:id, like/dislike using backend endpoints
- [ ] VideoPage: comments list (GET /api/comments/video/:videoId), add (POST /api/comments), delete (DELETE /api/comments/:commentId)
- [ ] Upload: submit POST /api/videos (protected)
- [ ] Channel: fetch GET /api/channels (protected) + list videos and allow delete via DELETE /api/videos/:id
- [ ] Verify all API integrations end-to-end against running backend at http://localhost:5000
- [ ] Run frontend dev server and ensure no build/runtime errors

