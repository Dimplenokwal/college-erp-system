const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// 🗄️ DATABASE CONNECTION
// ----------------------------------------------------
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'college_erp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Successfully connected to the MySQL database!');
        connection.release();
    }
});

// ----------------------------------------------------
// 📊 DASHBOARD ANALYTICS ROUTE
// ----------------------------------------------------
app.get('/api/dashboard/stats', (req, res) => {
    // This query fetches totals for the 4 dashboard cards
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM users WHERE role = 'student') as totalStudents,
            (SELECT COUNT(*) FROM attendance WHERE status = 'present' AND date = CURDATE()) as present,
            (SELECT COUNT(*) FROM attendance WHERE status = 'absent' AND date = CURDATE()) as absent,
            (SELECT COUNT(*) FROM attendance WHERE status = 'late' AND date = CURDATE()) as late
    `;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

// ----------------------------------------------------
// 🔐 AUTHENTICATION ROUTES
// ----------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const checkUserSql = 'SELECT * FROM users WHERE email = ?';
        
        db.query(checkUserSql, [email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) return res.status(400).json({ message: 'User already exists!' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const insertSql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';
            
            db.query(insertSql, [name, email, hashedPassword, role || 'student'], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration error' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials!' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
});

// ----------------------------------------------------
// 🎓 STUDENTS MANAGEMENT ROUTES
// ----------------------------------------------------

app.get('/api/students', (req, res) => {
    const sql = "SELECT id, name, email FROM users WHERE role = 'student' ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/students', async (req, res) => {
    const { name, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('student123', salt);
    const sql = "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'student')";
    
    db.query(sql, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Student added!' });
    });
});

// ----------------------------------------------------
// 📅 ATTENDANCE MANAGEMENT ROUTES
// ----------------------------------------------------

app.get('/api/attendance/:date', (req, res) => {
    const sql = `
        SELECT u.id as student_id, u.name, a.status 
        FROM users u 
        LEFT JOIN attendance a ON u.id = a.student_id AND a.date = ? 
        WHERE u.role = 'student'
        ORDER BY u.name ASC
    `;
    db.query(sql, [req.params.date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/attendance', (req, res) => {
    const { student_id, date, status } = req.body;
    const checkSql = "SELECT id FROM attendance WHERE student_id = ? AND date = ?";
    
    db.query(checkSql, [student_id, date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            const updateSql = "UPDATE attendance SET status = ? WHERE id = ?";
            db.query(updateSql, [status, results[0].id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Updated!' });
            });
        } else {
            const insertSql = "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)";
            db.query(insertSql, [student_id, date, status], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Marked!' });
            });
        }
    });
});

// ----------------------------------------------------
// 💰 FEES MANAGEMENT ROUTES
// ----------------------------------------------------

app.get('/api/fees', (req, res) => {
    const sql = `
        SELECT u.id as student_id, u.name, f.total_amount, f.amount_paid, f.due_date 
        FROM users u 
        LEFT JOIN fees f ON u.id = f.student_id 
        WHERE u.role = 'student'
        ORDER BY u.name ASC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/fees', (req, res) => {
    const { student_id, total_amount, amount_paid, due_date } = req.body;
    const checkSql = "SELECT id FROM fees WHERE student_id = ?";
    
    db.query(checkSql, [student_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            const updateSql = "UPDATE fees SET total_amount = ?, amount_paid = ?, due_date = ? WHERE student_id = ?";
            db.query(updateSql, [total_amount, amount_paid, due_date, student_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Fee updated!' });
            });
        } else {
            const insertSql = "INSERT INTO fees (student_id, total_amount, amount_paid, due_date) VALUES (?, ?, ?, ?)";
            db.query(insertSql, [student_id, total_amount, amount_paid, due_date], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Fee record created!' });
            });
        }
    });
});

// ----------------------------------------------------
// 🎧 START THE SERVER
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});