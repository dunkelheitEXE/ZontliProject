const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const database = require("./database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // You'll need to install this: npm install jsonwebtoken

const mailer = require('nodemailer');
require("dotenv").config({path: '../.env'});

const JWT_SECRET = process.env.JWT_SECRET || 'fish-bash-kitty';

// Middleware for parsing JSON request bodies
app.use(cors({origin: "http://localhost:4200",  credentials: true}));
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Define your API routes
app.get('/api/accounts/:user', async (req, res) => {
    const userId = req.params.user;
    const query = "SELECT * FROM accounts WHERE user_id = ?";
    try {
        const [rows, fields] = await database.execute(query, [userId]);
        if(rows) {
            res.status(201).json({
                success: true,
                message: rows
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Nothing to do"
            });
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Something has gone wrong in server, it is not your fault"
        });
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const newUser = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newUser['password'], salt);
        database.query('INSERT INTO user (name, last_name, birth_date, curp, email, phone_number, password, register_date) VALUES(?, ?, ?, ?, ?, ?, ?, NOW())',
            [newUser['fullName'], newUser['fullName'], newUser['date'], newUser['rfc'], newUser['email'], newUser['phoneNumber'], hashedPassword],
        ).then((results) => {
            res.status(201).json({
                'success': true,
                'message': newUser
            });
        }).catch(err => {
            res.status(401).json({
                'success': false,
                'message': 'Something has gone wrong: ' + err
            });
        });
        // res.json({ message: newUser, registered: true});
    } catch (e) {
        res.status(501).json({ 'success': false, 'message': "Internal Server Error"});
    }
});

app.post('/api/items', (req, res) => {
    const newItem = req.body;
    // Process the new item (e.g., save to database)
    res.status(201).json({ message: 'Item created', item: newItem });
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                'success': false, 
                'message': 'Email and password are required' 
            });
        }
        
        // Query to find user by email
        const query = "SELECT * FROM user WHERE email = ?";
        await database.query(query, [email]).then((rows)=>{
            const length = Object.keys(rows[0]).length;
            if(length === 0) {
                return res.status(401).json({
                    'success': false,
                    'message': "Credentials do not match with any registered"
                });
            } else {
                let userData = rows[0][0];
                bcrypt.compare(password, userData.password).then(valid => {
                    if (!valid) {
                        console.error("Password does not match");
                        return res.status(402).json({
                            'success': false,
                            'message': "Password does not match, please, check your sums"
                        });
                    } else {
                        // If ALL IS GOING well
                        const token = jwt.sign(
                            { 
                                userId: userData["user_id"], 
                                email: userData["email"]
                            },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );
                        const { password: _, ...userWithoutPassword } = rows[0];

                        const sanitizedUser = JSON.parse(JSON.stringify(userWithoutPassword, (key, value) =>
                            typeof value === 'bigint' ? value.toString() : value
                        ));
                        
                        return res.status(201).json({ 
                            'success': true, 
                            'message': 'Login successful',
                            'user': sanitizedUser,
                            'token': token
                        });

                    }
                }).catch(pswErr => {
                    return res.status(503).json({
                        'success': false,
                        'message': "Internal server error. " + pswErr
                    });
                });
            }
        }).catch(errno => {
            return res.status(502).json({
                'success': false,
                'message': "Internal server error. " + errno
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

app.post("/api/addAccount", (req, res) => {
    try {
        const [userId, type, balance, creditLimit=null] = req.body;
        console.log(req.body);
        if (userId && type && balance) {
            const query = "INSERT INTO accounts (user_id, account_type, balance, date, opening_date, status, credit_limit) VALUES(?, ?, ?, NOW(), NOW(), 0, ?)";
            database.query(query, [userId, type, balance, creditLimit]).then(() => {
                const getLast = "SELECT * FROM accounts WHERE user_id = ? ORDER BY date DESC LIMIT 1";
                database.query(getLast, [userId]).then(account => {
                    const accountToSaveMovement = account[0][0].account_id;
                    const query2 = "INSERT INTO movements (source_account_id,destination_account_id,amount,date,concept,movement_type,status)VALUES (?, ?, ?, NOW(), 'Account Created', 'initial balance', 1)";

                    database.query(query2, [accountToSaveMovement, accountToSaveMovement, balance]);
                }).catch(eje => {
                    return res.status(410).json({
                        'success': false,
                        'message': eje
                    });
                });

                res.status(201).json({
                    success: true,
                    message: "Recived Data from user: " + userId
                });
            }).catch(erno => {
                return res.status(501).json({
                    'success': false,
                    'message': erno
                });
            });
        } else {
            console.log("Data is not recived");
            res.status(404).json({
                success: false,
                message: "Something has gone wrong"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(405).json({
            success: false,
            message: "There is an error: " + error
        });
    }
});

app.post("/api/transfer", (req, res) => {
    // const [accountName, accountId, amount, description = ""] = req.body
    const formSent = req.body;
    try {
        if(formSent) {
            console.log(formSent[0]);

            const query = "CALL doTransfer(?, ?, ?, ?)";
            database.query(query, [formSent[0].amount, formSent[0].accountFrom, formSent[0].accountTo, formSent[0].description])
            .then(()=>{
                res.status(201).json({
                    success: true,
                    message: "Data was sent successfully"
                });
            })
            .catch(e=>{
                console.log("ERROR IN DATABASE\n")
                    res.status(400).json({
                    success: false,
                    message: "DATABASE ERROR"
                });
            });

        } else {
            console.log("ERROR");
            res.status(401).json({
                success: false,
                message: "Data has not sent"
            });
        }
    }
    catch(err) {
        res.status(401).json({
            success: false,
            message: "Internal Database or server error"
        });
    }
});

app.post("/api/testemail", async (req, res) => {
    try {
        const form = req.body;
        const query = "SELECT * FROM user WHERE user_id = (SELECT user_id FROM accounts WHERE account_id = ?);"

        database.query(query, [form[0].accountFrom]).then(user => {
            const email = user[0][0].email;
            const amountRecived = user[0][0].amount;
            database.query(query, [form[0].accountTo]).then(userTo => {
                const emailTo = userTo[0][0].email;
            }).catch(error => {
                console.log("ERROR TO RECIEVE");
            });
        }).catch(error=>{
            console.log("ERROR TO SEND")
        });

        // const [rows, fields] = await database.execute(query, [form[0].accountFrom])
        // const emailFrom = rows[0].email;
        // const amountRecived = form[0].amount;
        // const [rowsTo, fieldsTo] = await database.execute(query, [form[0].accountTo])
        // const emailTo = rowsTo[0].email;
        // console.log(emailFrom + " - To: " + emailTo);

        // const transport = mailer.createTransport({
        //     host: 'sandbox.smtp.mailtrap.io',
        //     port: '2525',
        //     secure: false,
        //     auth: {
        //         user: process.env.MAILUSER,
        //         pass: process.env.MAILPASSWORD,
        //     }
        // });
        

        // const mailOptions = {
        //     from: emailFrom,
        //     to: emailTo,
        //     subject: `Transaction Notification - Funds Received from ${emailFrom}`,
        //     text: `Dear User,

        //     We are writing to inform you that a transaction has been successfully completed.

        //     Transaction Details:
        //     - Amount Received: $${amountRecived}
        //     - Sender: ${emailFrom}
        //     - Date: ${new Date().toLocaleString()}

        //     If you have any questions or concerns regarding this transaction, please do not hesitate to contact our support team.

        //     Best regards,
        //     Payment Services Team`,
        // };

        // transport.sendMail(mailOptions, function(error) {
        //     if(error) {
        //         console.error(error);
        //     } else {
        //         console.log("Email sent !!!");
        //     }
        // })



        res.status(201).json({
            success: true,
            message: "GOOD: "
        });
    }catch (err) {
        console.error(err);
        res.status(401).json({
            success: false,
            message: "Something went wrong: " + err
        });
    }
});

app.get("/api/accountStatement/:account", async (req, res) => {
    try {
        const user = req.params.account;
        const query = "SELECT * FROM movements WHERE source_account_id = ?";
        const [rows, fields] = await database.execute(query, [user]);
        // console.log(rows);
        res.status(201).json({
            success: true,
            message: rows
        });
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Something has gone wrong: " + err
        });
    }
});


app.get('/api/getUserAccount/:user', (req, res)=>{
    const userId = req.params.user;
    const query = "SELECT * FROM accounts WHERE user_id = ? ORDER BY date DESC LIMIT 1";
    try{
        database.query(query, [userId]).then(accounts => {
            console.log(accounts[0][0].account_id);
            res.status(201).json({
                success: true,
                message: accounts[0][0].account_id
            });
        }).catch(error => {
            console.log("ERROR IN DATABASE 1.1");
            console.log(error)
            res.status(201).json({
                success: false,
                message: "Error in Database"
            });
        });
    } catch(err) {
        console.log("Interna server error");
        res.status(400).json({
            success: false,
            message: "Internal server error"
        });
    }
});


app.get("/api/getUser/:user", async (req, res) => {
    try {
        const userId = req.params.user;
        const query = "SELECT * FROM user WHERE user_id = ?"
        const [rows, fields] = await database.execute(query, [userId]);
        console.log("USER GOTTEN !");
        res.status(201).json({
            success: true,
            message: rows
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            message: err
        });
    }
});


app.get("/api/getAccount/:account", async (req, res) => {
    try {
        const accountId = req.params.account;
        const query = "SELECT * FROM accounts WHERE account_id = ?";
        const [rows ,fields] = await database.execute(query, [accountId]);
        console.log("ACCOUNT DATA GOTTEN !");
        res.status(201).json({
            success: true,
            message: rows
        });
    } catch (err) {
        console.log("Something has gone wrong");
        res.status(401).json({
            success: false,
            message: err
        });
    }
});

app.get("/api/getLastMovement/:user", async (req,res) => {
    try {
        const user = req.params.user;
        const query = "SELECT * FROM movements WHERE source_account_id = ? ORDER BY date DESC LIMIT 1";
        database.query(query, [user]).then(rows=>{
            console.log("GETTING OK");
            console.log(rows);
            res.status(201).json({
                success: true,
                message: rows[0][0]
            });
        }).catch(error => {
            console.log("ERROR TO GET THE LAST MOVEMENT");
                res.status(401).json({
                success: false,
                message: error
            });
        });
        
    } catch (err) {
        res.status(401).json({
            success: false,
            message: err
        });
    }
});

// Request password reset - sends email with reset token
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if user exists
        const query = "SELECT * FROM user WHERE email = ?";
        const [rows] = await database.query(query, [email]);

        if (rows.length === 0) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a password reset link will be sent'
            });
        }

        const user = rows[0];

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user.user_id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Setup email transporter
        const transport = mailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: '2525',
            secure: false,
            auth: {
                user: process.env.MAILUSER,
                pass: process.env.MAILPASSWORD,
            }
        });

        // Create reset link (adjust URL to your frontend URL)
        const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: 'noreply@yourapp.com',
            to: email,
            subject: 'Password Reset Request',
            text: `Dear User,

We received a request to reset your password. Please click the link below to reset your password:

${resetLink}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email.

Best regards,
Your App Team`,
            html: `
                <h2>Password Reset Request</h2>
                <p>Dear User,</p>
                <p>We received a request to reset your password. Please click the button below to reset your password:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p>${resetLink}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>Your App Team</p>
            `
        };

        await transport.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, a password reset link will be sent'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Reset password - validates token and updates password
app.post('/api/resetPassword', async (req, res) => {
    try {
        const data = req.body;

        console.log("HERE");

        const token = data[0];
        const newPassword = data[1];

        console.log(token);
        console.log(newPassword);

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in database
        const query = "UPDATE user SET password = ? WHERE user_id = ?";
        await database.query(query, [hashedPassword, decoded.userId]);

        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.post('/api/create-admin', (req, res) => {
    try {
        const query = "INSERT INTO "
    } catch(err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Express API listening on port http://localhost:${PORT}`);
});
