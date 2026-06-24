# Frontend TODO (YouTube Clone - React Vite)

- [ ] Create Vite + React project structure in `frontend/` (index.html, vite config, src/*)
- [ ] Add core dependencies (react-router-dom, axios, tailwind) and set up Tailwind (or simple CSS fallback)
- [ ] Implement `src/api/axios.js` with baseURL http://localhost:5000 and auth header injection
- [ ] Implement `src/context/AuthContext.jsx` (register/login/logout, token in localStorage, hydrate on load)
- [ ] Implement protected route wrapper for authenticated-only pages
- [ ] Implement shared UI components: Navbar, VideoCard, Loader, Comment
- [ ] Implement pages: Register, Login, Home, VideoPage, Upload (protected)
- [ ] App routing in `src/App.jsx` using React Router
- [ ] Home: fetch GET /api/videos and render grid using VideoCard
- [ ] VideoPage: fetch GET /api/videos/:id, like/dislike, comments CRUD
- [ ] Upload: submit POST /api/videos (protected)
- [ ] Verify all API integrations end-to-end against running backend at http://localhost:5000
- [ ] Run frontend dev server and ensure no build/runtime errors

