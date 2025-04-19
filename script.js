let users = [];
let currentEditIndex = null;

// Load users from localStorage if available
if (localStorage.getItem('users')) {
    users = JSON.parse(localStorage.getItem('users'));
}

function saveUsersToStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

function generateCode(index) {
    return 'GD' + String(index + 1).padStart(3, '0');
}

function renderTable() {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    users.forEach((user, idx) => {
        const tr = document.createElement('tr');
        if (user.editing) {
            tr.innerHTML = `
                <td>${user.code}</td>
                <td><input type="text" value="${user.accountName}" id="editAccount${idx}"></td>
                <td><input type="text" value="${user.bankCode}" id="editBank${idx}"></td>
                <td><input type="text" value="${user.playerStatus}" id="editStatus${idx}"></td>
                <td>
                    <button class="save-btn" onclick="saveEdit(${idx})">حفظ</button>
                    <button class="cancel-btn" onclick="cancelEdit(${idx})">إلغاء</button>
                </td>
                <td></td>
            `;
        } else {
            tr.innerHTML = `
                <td>${user.code}</td>
                <td>${user.accountName}</td>
                <td>${user.bankCode}</td>
                <td>${user.playerStatus}</td>
                <td><button class="edit-btn" onclick="editUser(${idx})">تعديل</button></td>
                <td><button class="delete-btn" onclick="deleteUser(${idx})">حذف</button></td>
            `;
        }
        tbody.appendChild(tr);
    });
}

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const accountName = document.getElementById('accountName').value.trim();
    const bankCode = document.getElementById('bankCode').value.trim();
    const playerStatus = document.getElementById('playerStatus').value.trim();
    if (!accountName || !bankCode || !playerStatus) return;
    const code = generateCode(users.length);
    users.push({ code, accountName, bankCode, playerStatus, editing: false });
    this.reset();
    renderTable();
    saveUsersToStorage();
});

window.editUser = function(idx) {
    users = users.map((u, i) => ({ ...u, editing: i === idx }));
    renderTable();
    saveUsersToStorage();
}

window.saveEdit = function(idx) {
    const accountName = document.getElementById('editAccount' + idx).value.trim();
    const bankCode = document.getElementById('editBank' + idx).value.trim();
    const playerStatus = document.getElementById('editStatus' + idx).value.trim();
    if (!accountName || !bankCode || !playerStatus) return;
    users[idx] = { ...users[idx], accountName, bankCode, playerStatus, editing: false };
    renderTable();
    saveUsersToStorage();
}

window.cancelEdit = function(idx) {
    users[idx].editing = false;
    renderTable();
    saveUsersToStorage();
}

window.deleteUser = function(idx) {
    users.splice(idx, 1);
    renderTable();
    saveUsersToStorage();
}

// --- Mesmerizing flying objects background ---
function randomColor() {
    const colors = [
        '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

const flyingCount = 12;
const flyingObjects = Array.from({length: flyingCount}, (_, i) => ({
    radius: 18 + Math.random() * 22,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    color: randomColor(),
    phase: Math.random() * Math.PI * 2,
    speed: 0.7 + Math.random() * 0.7,
    direction: Math.random() > 0.5 ? 1 : -1
}));

function resizeCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);

function animateFlying() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now() * 0.001;
    flyingObjects.forEach((obj, i) => {
        // Mesmerizing movement: sine + cos + back and forth
        const x = obj.x + Math.sin(time * obj.speed + obj.phase) * (80 + 60 * Math.sin(time * 0.2 + i));
        const y = obj.y + Math.cos(time * obj.speed * 0.8 + obj.phase) * (60 + 40 * Math.cos(time * 0.15 + i));
        ctx.beginPath();
        ctx.arc(x, y, obj.radius, 0, Math.PI * 2);
        ctx.fillStyle = obj.color + 'cc'; // semi-transparent
        ctx.shadowColor = obj.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    requestAnimationFrame(animateFlying);
}
document.addEventListener('DOMContentLoaded', function() {
    resizeCanvas();
    animateFlying();
    renderTable();
    setTimeout(() => {
        const modal = document.getElementById('access-modal');
        modal.style.display = 'flex';
        document.getElementById('access-code-input').focus();
    }, 1000);

    const modal = document.getElementById('access-modal');
    const input = document.getElementById('access-code-input');
    const submit = document.getElementById('access-submit');
    const error = document.getElementById('access-error');

    function tryAccess() {
        if (input.value === ':666333') {
            modal.style.display = 'none';
        } else {
            error.textContent = 'رمز الدخول غير صحيح';
            input.value = '';
            input.focus();
        }
    }
    submit.onclick = tryAccess;
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') tryAccess();
    });
});
