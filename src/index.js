const ADMIN_PASSWORD = ENV.ADMIN_PASSWORD || 'changeme123';
const DB = ENV.WORDBOOK_DB;

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/') {
    return new Response(adminPage(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  if (path.startsWith('/api/')) {
    return handleApi(request, path);
  }

  return new Response('Not Found', { status: 404 });
}

async function handleApi(request, path) {
  if (path === '/api/search') {
    return handleSearch(request);
  }
  if (path === '/api/words') {
    return handleWords(request);
  }
  if (path.match(/\/api\/words\/\d+/)) {
    return handleWord(request, path);
  }
  if (path === '/api/import') {
    return handleImport(request);
  }
  if (path === '/api/export') {
    return handleExport(request);
  }
  return new Response(JSON.stringify({ error: 'API not found' }), { status: 404 });
}

async function handleSearch(request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const level = url.searchParams.get('level');

  if (!q) {
    return jsonError('Query parameter required', 400);
  }

  let query = 'SELECT * FROM words WHERE ';
  const params = [];
  const isZh = /[\u4e00-\u9fa5]/.test(q);

  if (isZh) {
    query += 'zh LIKE ?';
    params.push(`%${q}%`);
  } else {
    query += 'en LIKE ?';
    params.push(`%${q.toLowerCase()}%`);
  }

  if (level) {
    query += ' AND level = ?';
    params.push(level);
  }

  query += ' ORDER BY level, category, en LIMIT 50';

  try {
    const stmt = DB.prepare(query);
    const results = await stmt.bind(...params).all();
    return jsonSuccess(results.results);
  } catch (e) {
    return jsonError(e.message, 500);
  }
}

async function handleWords(request) {
  if (request.method === 'GET') {
    return handleListWords(request);
  }
  if (request.method === 'POST') {
    return handleCreateWord(request);
  }
  return jsonError('Method not allowed', 405);
}

async function handleListWords(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const level = url.searchParams.get('level');
  const category = url.searchParams.get('category');

  let query = 'SELECT * FROM words';
  const params = [];
  const conditions = [];

  if (level) {
    conditions.push('level = ?');
    params.push(level);
  }
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY level, category, en LIMIT ? OFFSET ?';
  params.push(limit, (page - 1) * limit);

  try {
    const stmt = DB.prepare(query);
    const results = await stmt.bind(...params).all();

    const countStmt = DB.prepare(`SELECT COUNT(*) as total FROM words ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`);
    const countResult = await countStmt.bind(...conditions.map(() => params.shift())).first();

    return jsonSuccess({
      data: results.results,
      total: countResult.total,
      page,
      limit
    });
  } catch (e) {
    return jsonError(e.message, 500);
  }
}

async function handleCreateWord(request) {
  if (!await checkAuth(request)) {
    return jsonError('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const { en, zh, ipa, emoji, category, level } = body;

    if (!en || !zh) {
      return jsonError('en and zh are required', 400);
    }

    const stmt = DB.prepare(
      'INSERT INTO words (en, zh, ipa, emoji, category, level) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = await stmt.bind(en.toLowerCase(), zh, ipa || '', emoji || '', category || '', level || '').run();

    return jsonSuccess({ id: result.lastInsertRowId, en, zh, ipa, emoji, category, level }, 201);
  } catch (e) {
    return jsonError(e.message, 500);
  }
}

async function handleWord(request, path) {
  const id = parseInt(path.split('/').pop());

  if (request.method === 'GET') {
    try {
      const stmt = DB.prepare('SELECT * FROM words WHERE id = ?');
      const result = await stmt.bind(id).first();
      if (!result) {
        return jsonError('Word not found', 404);
      }
      return jsonSuccess(result);
    } catch (e) {
      return jsonError(e.message, 500);
    }
  }

  if (request.method === 'PUT') {
    if (!await checkAuth(request)) {
      return jsonError('Unauthorized', 401);
    }

    try {
      const body = await request.json();
      const { en, zh, ipa, emoji, category, level } = body;

      const fields = [];
      const params = [];

      if (en) { fields.push('en = ?'); params.push(en.toLowerCase()); }
      if (zh) { fields.push('zh = ?'); params.push(zh); }
      if (ipa !== undefined) { fields.push('ipa = ?'); params.push(ipa); }
      if (emoji !== undefined) { fields.push('emoji = ?'); params.push(emoji); }
      if (category !== undefined) { fields.push('category = ?'); params.push(category); }
      if (level !== undefined) { fields.push('level = ?'); params.push(level); }
      fields.push('updated_at = CURRENT_TIMESTAMP');

      if (fields.length === 0) {
        return jsonError('No fields to update', 400);
      }

      const stmt = DB.prepare(`UPDATE words SET ${fields.join(', ')} WHERE id = ?`);
      params.push(id);
      await stmt.bind(...params).run();

      const getStmt = DB.prepare('SELECT * FROM words WHERE id = ?');
      const result = await getStmt.bind(id).first();

      return jsonSuccess(result);
    } catch (e) {
      return jsonError(e.message, 500);
    }
  }

  if (request.method === 'DELETE') {
    if (!await checkAuth(request)) {
      return jsonError('Unauthorized', 401);
    }

    try {
      const stmt = DB.prepare('DELETE FROM words WHERE id = ?');
      await stmt.bind(id).run();
      return jsonSuccess({ message: 'Word deleted' });
    } catch (e) {
      return jsonError(e.message, 500);
    }
  }

  return jsonError('Method not allowed', 405);
}

async function handleImport(request) {
  if (!await checkAuth(request)) {
    return jsonError('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const words = body.words;

    if (!Array.isArray(words)) {
      return jsonError('words must be an array', 400);
    }

    let inserted = 0;
    let skipped = 0;

    for (const word of words) {
      if (!word.en || !word.zh) {
        skipped++;
        continue;
      }

      try {
        const stmt = DB.prepare(
          'INSERT OR IGNORE INTO words (en, zh, ipa, emoji, category, level) VALUES (?, ?, ?, ?, ?, ?)'
        );
        const result = await stmt.bind(
          word.en.toLowerCase(),
          word.zh,
          word.ipa || '',
          word.emoji || '',
          word.category || '',
          word.level || ''
        ).run();

        if (result.changes > 0) {
          inserted++;
        } else {
          skipped++;
        }
      } catch {
        skipped++;
      }
    }

    return jsonSuccess({ inserted, skipped, total: words.length });
  } catch (e) {
    return jsonError(e.message, 500);
  }
}

async function handleExport(request) {
  try {
    const stmt = DB.prepare('SELECT * FROM words ORDER BY level, category, en');
    const results = await stmt.all();

    return new Response(JSON.stringify(results.results, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename=words-export.json'
      }
    });
  } catch (e) {
    return jsonError(e.message, 500);
  }
}

async function checkAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === ADMIN_PASSWORD;
}

function jsonSuccess(data, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function jsonError(message, status = 500) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function adminPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>词汇管理后台</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #333; }
.header { background: #4a90d9; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.header h1 { font-size: 20px; font-weight: 600; }
.header .auth-area { display: flex; gap: 12px; align-items: center; }
.header input { padding: 6px 12px; border: none; border-radius: 6px; font-size: 14px; }
.header button { padding: 6px 16px; border: none; border-radius: 6px; background: rgba(255,255,255,0.2); color: white; cursor: pointer; }
.container { max-width: 1200px; margin: 0 auto; padding: 24px; }
.card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 20px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #444; }
.form-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.form-group { flex: 1; min-width: 150px; }
.form-group label { display: block; font-size: 13px; color: #666; margin-bottom: 4px; }
.form-group input { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
.btn { padding: 8px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; }
.btn-primary { background: #4a90d9; color: white; }
.btn-danger { background: #e74c3c; color: white; }
.btn-success { background: #27ae60; color: white; }
.btn-warning { background: #f39c12; color: white; }
.btn-sm { padding: 4px 12px; font-size: 12px; }
.search-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.search-bar input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
.table th { background: #f8f9fa; font-weight: 600; font-size: 13px; color: #666; }
.table td { font-size: 14px; }
.table tr:hover { background: #fafafa; }
.pagination { display: flex; justify-content: center; gap: 8px; margin-top: 16px; }
.pagination button { padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer; }
.pagination button.active { background: #4a90d9; color: white; border-color: #4a90d9; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 100; }
.modal.show { display: flex; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 90%; max-width: 500px; }
.modal-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
.close-btn { float: right; font-size: 24px; cursor: pointer; color: #999; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
.badge-primary { background: #e3f2fd; color: #1976d2; }
.badge-success { background: #e8f5e9; color: #388e3c; }
.status-bar { padding: 8px 16px; background: #e8f5e9; border-radius: 6px; margin-bottom: 16px; font-size: 14px; color: #388e3c; }
.status-bar.error { background: #ffebee; color: #c62828; }
.import-area { background: #f8f9fa; border: 2px dashed #ddd; border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; }
.import-area:hover { border-color: #4a90d9; background: #f0f7ff; }
.import-area textarea { width: 100%; height: 150px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: monospace; font-size: 13px; resize: vertical; }
</style>
</head>
<body>
<div class="header">
  <h1>📚 词汇管理后台</h1>
  <div class="auth-area">
    <input type="password" id="authInput" placeholder="管理员密码">
    <button onclick="toggleAuth()">登录</button>
    <span id="authStatus" style="font-size:13px"></span>
  </div>
</div>

<div class="container">
  <div class="card">
    <div class="card-title">🔍 搜索词汇</div>
    <div class="search-bar">
      <input type="text" id="searchInput" placeholder="输入英文或中文搜索">
      <select id="levelFilter">
        <option value="">全部年级</option>
        <option value="primary">小学</option>
        <option value="junior">初中</option>
      </select>
      <button class="btn btn-primary" onclick="searchWords()">搜索</button>
      <button class="btn btn-success" onclick="exportWords()">导出数据</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">➕ 批量导入</div>
    <div class="import-area" onclick="document.getElementById('importText').focus()">
      <textarea id="importText" placeholder='[{"en":"apple","zh":"苹果","ipa":"ˈæpəl","level":"primary"},...]'></textarea>
      <button class="btn btn-warning" onclick="importWords()" style="margin-top:12px">开始导入</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">📝 添加单词</div>
    <div class="form-row">
      <div class="form-group"><label>英文</label><input id="newEn" placeholder="apple"></div>
      <div class="form-group"><label>中文</label><input id="newZh" placeholder="苹果"></div>
      <div class="form-group"><label>音标</label><input id="newIpa" placeholder="ˈæpəl"></div>
      <div class="form-group"><label>表情</label><input id="newEmoji" placeholder="🍎"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>分类</label><input id="newCategory" placeholder="animals"></div>
      <div class="form-group"><label>年级</label><select id="newLevel"><option value="">选择年级</option><option value="primary">小学</option><option value="junior">初中</option></select></div>
      <div style="display:flex;align-items:flex-end"><button class="btn btn-primary" onclick="addWord()">添加</button></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">📋 词汇列表</div>
    <div id="statusBar"></div>
    <table class="table">
      <thead>
        <tr><th>ID</th><th>英文</th><th>中文</th><th>音标</th><th>表情</th><th>分类</th><th>年级</th><th>操作</th></tr>
      </thead>
      <tbody id="wordList"></tbody>
    </table>
    <div class="pagination" id="pagination"></div>
  </div>
</div>

<div class="modal" id="editModal">
  <div class="modal-content">
    <span class="close-btn" onclick="closeModal()">&times;</span>
    <div class="modal-title">编辑单词</div>
    <input type="hidden" id="editId">
    <div class="form-row">
      <div class="form-group"><label>英文</label><input id="editEn"></div>
      <div class="form-group"><label>中文</label><input id="editZh"></div>
      <div class="form-group"><label>音标</label><input id="editIpa"></div>
      <div class="form-group"><label>表情</label><input id="editEmoji"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>分类</label><input id="editCategory"></div>
      <div class="form-group"><label>年级</label><select id="editLevel"><option value="">选择年级</option><option value="primary">小学</option><option value="junior">初中</option></select></div>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px">
      <button class="btn btn-primary" onclick="saveEdit()">保存</button>
      <button class="btn btn-danger" onclick="deleteWord()">删除</button>
      <button class="btn" onclick="closeModal()">取消</button>
    </div>
  </div>
</div>

<script>
let authToken = '';
let currentPage = 1;
let totalPages = 1;

async function apiRequest(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authToken) {
    headers['Authorization'] = 'Bearer ' + authToken;
  }
  const response = await fetch(url, { ...options, headers });
  return await response.json();
}

function toggleAuth() {
  const password = document.getElementById('authInput').value;
  const status = document.getElementById('authStatus');
  
  if (authToken) {
    authToken = '';
    status.textContent = '未登录';
    status.style.color = '#fff';
    document.getElementById('authInput').value = '';
    return;
  }
  
  authToken = password;
  status.textContent = '已登录';
  status.style.color = '#81c784';
}

function showStatus(msg, isError = false) {
  const bar = document.getElementById('statusBar');
  bar.textContent = msg;
  bar.className = isError ? 'status-bar error' : 'status-bar';
}

async function searchWords() {
  const q = document.getElementById('searchInput').value;
  const level = document.getElementById('levelFilter').value;
  
  let url = '/api/search?q=' + encodeURIComponent(q);
  if (level) url += '&level=' + level;
  
  const result = await apiRequest(url);
  if (result.success) {
    renderWords(result.data);
    document.getElementById('pagination').innerHTML = '';
  } else {
    showStatus('搜索失败: ' + result.error, true);
  }
}

async function loadWords(page = 1) {
  const level = document.getElementById('levelFilter').value;
  let url = '/api/words?page=' + page + '&limit=20';
  if (level) url += '&level=' + level;
  
  const result = await apiRequest(url);
  if (result.success) {
    renderWords(result.data.data);
    currentPage = result.data.page;
    totalPages = Math.ceil(result.data.total / 20);
    renderPagination();
    showStatus('共 ' + result.data.total + ' 个单词');
  } else {
    showStatus('加载失败: ' + result.error, true);
  }
}

function renderWords(words) {
  const tbody = document.getElementById('wordList');
  tbody.innerHTML = '';
  
  if (words.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999">暂无数据</td></tr>';
    return;
  }
  
  words.forEach(w => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${w.id}</td>
      <td><strong>${w.en}</strong></td>
      <td>${w.zh}</td>
      <td style="font-style:italic;color:#666">/${w.ipa || ''}/</td>
      <td>${w.emoji || ''}</td>
      <td><span class="badge badge-primary">${w.category || '-'}</span></td>
      <td><span class="badge ${w.level === 'primary' ? 'badge-success' : 'badge-warning'}">${w.level === 'primary' ? '小学' : w.level === 'junior' ? '初中' : '-'}</span></td>
      <td><button class="btn btn-sm btn-primary" onclick="openEdit(${w.id})">编辑</button></td>
    `;
    tbody.appendChild(row);
  });
}

function renderPagination() {
  const container = document.getElementById('pagination');
  container.innerHTML = '';
  
  if (totalPages <= 1) return;
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '上一页';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => loadWords(currentPage - 1);
  container.appendChild(prevBtn);
  
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.className = 'active';
    btn.onclick = () => loadWords(i);
    container.appendChild(btn);
  }
  
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '下一页';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => loadWords(currentPage + 1);
  container.appendChild(nextBtn);
}

async function addWord() {
  const word = {
    en: document.getElementById('newEn').value.trim(),
    zh: document.getElementById('newZh').value.trim(),
    ipa: document.getElementById('newIpa').value.trim(),
    emoji: document.getElementById('newEmoji').value.trim(),
    category: document.getElementById('newCategory').value.trim(),
    level: document.getElementById('newLevel').value
  };
  
  if (!word.en || !word.zh) {
    showStatus('请填写英文和中文', true);
    return;
  }
  
  const result = await apiRequest('/api/words', {
    method: 'POST',
    body: JSON.stringify(word)
  });
  
  if (result.success) {
    showStatus('添加成功');
    document.getElementById('newEn').value = '';
    document.getElementById('newZh').value = '';
    document.getElementById('newIpa').value = '';
    document.getElementById('newEmoji').value = '';
    document.getElementById('newCategory').value = '';
    document.getElementById('newLevel').value = '';
    loadWords();
  } else {
    showStatus('添加失败: ' + result.error, true);
  }
}

async function openEdit(id) {
  const result = await apiRequest('/api/words/' + id);
  if (result.success) {
    const w = result.data;
    document.getElementById('editId').value = w.id;
    document.getElementById('editEn').value = w.en;
    document.getElementById('editZh').value = w.zh;
    document.getElementById('editIpa').value = w.ipa || '';
    document.getElementById('editEmoji').value = w.emoji || '';
    document.getElementById('editCategory').value = w.category || '';
    document.getElementById('editLevel').value = w.level || '';
    document.getElementById('editModal').classList.add('show');
  }
}

function closeModal() {
  document.getElementById('editModal').classList.remove('show');
}

async function saveEdit() {
  const id = document.getElementById('editId').value;
  const word = {
    en: document.getElementById('editEn').value.trim(),
    zh: document.getElementById('editZh').value.trim(),
    ipa: document.getElementById('editIpa').value.trim(),
    emoji: document.getElementById('editEmoji').value.trim(),
    category: document.getElementById('editCategory').value.trim(),
    level: document.getElementById('editLevel').value
  };
  
  const result = await apiRequest('/api/words/' + id, {
    method: 'PUT',
    body: JSON.stringify(word)
  });
  
  if (result.success) {
    showStatus('保存成功');
    closeModal();
    loadWords();
  } else {
    showStatus('保存失败: ' + result.error, true);
  }
}

async function deleteWord() {
  const id = document.getElementById('editId').value;
  if (!confirm('确定要删除这个单词吗？')) return;
  
  const result = await apiRequest('/api/words/' + id, {
    method: 'DELETE'
  });
  
  if (result.success) {
    showStatus('删除成功');
    closeModal();
    loadWords();
  } else {
    showStatus('删除失败: ' + result.error, true);
  }
}

async function importWords() {
  const text = document.getElementById('importText').value.trim();
  if (!text) {
    showStatus('请输入导入数据', true);
    return;
  }
  
  try {
    const words = JSON.parse(text);
    const result = await apiRequest('/api/import', {
      method: 'POST',
      body: JSON.stringify({ words })
    });
    
    if (result.success) {
      showStatus(`导入完成: 新增 ${result.data.inserted} 个, 跳过 ${result.data.skipped} 个`);
      document.getElementById('importText').value = '';
      loadWords();
    } else {
      showStatus('导入失败: ' + result.error, true);
    }
  } catch (e) {
    showStatus('JSON格式错误: ' + e.message, true);
  }
}

async function exportWords() {
  const response = await fetch('/api/export', { headers: authToken ? { 'Authorization': 'Bearer ' + authToken } : {} });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'words-export.json';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('searchInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') searchWords();
});

loadWords();
</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    ENV = env;
    return handleRequest(request);
  }
};
